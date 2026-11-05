import { v } from 'convex/values'
import { api, internal } from './_generated/api'
import type { Doc } from './_generated/dataModel'
import type { ActionCtx, MutationCtx } from './_generated/server'
import { action, internalAction, mutation } from './_generated/server'
import {
    donationValidator,
    donorValidator,
    statsValidator,
} from './donor_drive_validators'
import type {
    DonationRowInput,
    DonorDriveDonation,
    DonorDriveDonor,
    DonorDriveParticipant,
    DonorRowInput,
} from './lib/donordrive'
import {
    DONORDRIVE_PAGE_SIZE,
    donationSchema,
    donorSchema,
    hasMorePages,
    parseRecords,
    participantSchema,
    splitPage,
    toCampaignFields,
    toDonationRow,
    toDonorRow,
} from './lib/donordrive'
import { getDonorDrive } from './lib/donordriveHttp'

const IN_FLIGHT_LEASE_MS = 60_000

type SyncPull = {
    participantId: string | null
    participant: DonorDriveParticipant | null
    latestDonations: DonorDriveDonation[]
    topDonor: DonorDriveDonor | null
}

const isBlocked = (
    force: boolean,
    state: Doc<'syncState'> | null,
    now: number
): boolean =>
    !force && state?.blockedUntil !== undefined && state.blockedUntil > now

async function performSync(
    ctx: ActionCtx,
    campaign: Doc<'campaigns'>,
    options: { force: boolean }
): Promise<SyncPull> {
    const startedAt = Date.now()
    const pull: SyncPull = {
        participantId: campaign.participantId,
        participant: null,
        latestDonations: [],
        topDonor: null,
    }
    let donationsInserted = 0
    let donorsWritten = 0

    const participantId = campaign.participantId

    const states: {
        participant: Doc<'syncState'> | null
        donations: Doc<'syncState'> | null
        donors: Doc<'syncState'> | null
    } = await ctx.runQuery(internal.syncStore.loadStates, { participantId })

    let apiCallRecorded = false
    const recordApiCall = async (): Promise<void> => {
        if (apiCallRecorded) return
        apiCallRecorded = true
        await ctx.runMutation(api.apiMetadata.updateLastApiCall, {})
    }

    // step 3: participant
    const participantKey = `participant:${participantId}`
    if (!isBlocked(options.force, states.participant, Date.now())) {
        await recordApiCall()
        const etag = options.force ? undefined : states.participant?.etag
        const response = await getDonorDrive(
            `/participants/${participantId}`,
            {},
            etag
        )
        if (response.kind === 'ok') {
            const parsed = participantSchema.safeParse(response.body)
            if (parsed.success) {
                pull.participant = parsed.data
                const fields = toCampaignFields(parsed.data)
                await ctx.runMutation(internal.syncStore.applyParticipant, {
                    campaignId: campaign._id,
                    fields,
                })
                await ctx.runMutation(api.donorDriveDebug.add, {
                    stats: parsed.data,
                    topDonation: null,
                    topDonor: null,
                    latestDonations: null,
                    apiEndpoint: `GET /participants/${participantId}`,
                })
                await ctx.runMutation(internal.syncStore.recordFetch, {
                    key: participantKey,
                    status: 200,
                    etag: response.etag,
                })
            } else {
                console.warn(
                    'failed to fetch donordrive',
                    JSON.stringify({
                        endpoint: participantKey,
                        status: 200,
                        error: parsed.error.message,
                    })
                )
                await ctx.runMutation(internal.syncStore.recordFetch, {
                    key: participantKey,
                    status: 200,
                    error: parsed.error.message,
                })
            }
        } else if (response.kind === 'not-modified') {
            await ctx.runMutation(internal.syncStore.recordFetch, {
                key: participantKey,
                status: 304,
            })
        } else if (response.kind === 'rate-limited') {
            const blockedUntil = Date.now() + response.retryAfterMs
            console.warn(
                'donordrive rate limited',
                JSON.stringify({
                    endpoint: participantKey,
                    blocked_until: blockedUntil,
                })
            )
            await ctx.runMutation(internal.syncStore.recordFetch, {
                key: participantKey,
                status: 429,
                error: 'rate limited',
                blockedUntil,
            })
        } else {
            console.warn(
                'failed to fetch donordrive',
                JSON.stringify({
                    endpoint: participantKey,
                    status: response.status,
                    error: response.message,
                })
            )
            await ctx.runMutation(internal.syncStore.recordFetch, {
                key: participantKey,
                status: response.status,
                error: response.message,
            })
        }
    }

    // step 4: donations
    const donationsKey = `donations:${participantId}`
    if (!isBlocked(options.force, states.donations, Date.now())) {
        const firstEtag = options.force ? undefined : states.donations?.etag
        const recoverAll =
            states.donations?.lastError !== undefined &&
            states.donations?.lastStatus !== 200 &&
            states.donations?.lastStatus !== 304
        let offset = 0
        let firstPageEtag: string | undefined
        let pagingFailed = false
        let stepEnded = false
        const recordErrors: string[] = []

        try {
            while (!stepEnded) {
                await recordApiCall()
                const etagToSend = offset === 0 ? firstEtag : undefined
                const response = await getDonorDrive(
                    `/participants/${participantId}/donations`,
                    {
                        orderBy: 'createdDateUTC DESC',
                        limit: String(DONORDRIVE_PAGE_SIZE),
                        offset: String(offset),
                    },
                    etagToSend
                )

                if (offset === 0 && response.kind === 'not-modified') {
                    await ctx.runMutation(internal.syncStore.recordFetch, {
                        key: donationsKey,
                        status: 304,
                    })
                    stepEnded = true
                    break
                }
                if (response.kind === 'rate-limited') {
                    const blockedUntil = Date.now() + response.retryAfterMs
                    console.warn(
                        'donordrive rate limited',
                        JSON.stringify({
                            endpoint: donationsKey,
                            blocked_until: blockedUntil,
                        })
                    )
                    await ctx.runMutation(internal.syncStore.recordFetch, {
                        key: donationsKey,
                        status: 429,
                        error: 'rate limited',
                        blockedUntil,
                    })
                    pagingFailed = true
                    stepEnded = true
                    break
                }
                if (response.kind !== 'ok') {
                    const status =
                        response.kind === 'not-modified' ? 304 : response.status
                    const error =
                        response.kind === 'not-modified'
                            ? 'unexpected 304 past the first page'
                            : response.message
                    console.warn(
                        'failed to fetch donordrive',
                        JSON.stringify({
                            endpoint: donationsKey,
                            status,
                            error,
                        })
                    )
                    await ctx.runMutation(internal.syncStore.recordFetch, {
                        key: donationsKey,
                        ...(response.kind === 'error' ? {} : { status }),
                        error,
                    })
                    pagingFailed = true
                    stepEnded = true
                    break
                }

                if (offset === 0) firstPageEtag = response.etag
                const { records, errors, pageLength } = parseRecords(
                    donationSchema,
                    response.body
                )
                recordErrors.push(...errors)

                const rows: DonationRowInput[] = []
                for (const record of records) {
                    const row = toDonationRow(record, {
                        year: campaign.year,
                        participantId,
                    })
                    if (row === null)
                        recordErrors.push(
                            'missing donationID or createdDateUTC'
                        )
                    else rows.push(row)
                }

                const known: string[] = await ctx.runQuery(
                    internal.syncStore.knownDonationIds,
                    { ids: rows.map((row) => row.donationID) }
                )
                const { fresh } = splitPage(rows, new Set(known))
                const insertResult: { inserted: number } =
                    await ctx.runMutation(internal.syncStore.insertDonations, {
                        rows: fresh,
                    })
                donationsInserted += insertResult.inserted

                if (offset === 0) pull.latestDonations = records.slice(0, 10)

                await ctx.runMutation(api.donorDriveDebug.add, {
                    latestDonations: records,
                    stats: null,
                    topDonation: null,
                    topDonor: null,
                    apiEndpoint: `GET /participants/${participantId}/donations?offset=${offset}`,
                })

                if (!hasMorePages(pageLength, fresh.length, recoverAll)) break
                offset += DONORDRIVE_PAGE_SIZE
            }

            if (!stepEnded) {
                if (recordErrors.length > 0) {
                    console.warn(
                        'skipped donordrive records',
                        JSON.stringify({
                            endpoint: donationsKey,
                            error_count: recordErrors.length,
                        })
                    )
                }
                await ctx.runMutation(internal.syncStore.recordFetch, {
                    key: donationsKey,
                    status: 200,
                    etag: pagingFailed ? undefined : firstPageEtag,
                    error:
                        recordErrors.length > 0
                            ? recordErrors.join('; ')
                            : undefined,
                })
            }
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error)
            try {
                await ctx.runMutation(internal.syncStore.recordFetch, {
                    key: donationsKey,
                    error: message,
                })
            } catch {
                // preserve the original error below
            }
            throw error
        }
    }

    // step 5: donors
    const donorsKey = `donors:${participantId}`
    if (!isBlocked(options.force, states.donors, Date.now())) {
        const firstEtag = options.force ? undefined : states.donors?.etag
        let offset = 0
        let firstPageEtag: string | undefined
        let pagingFailed = false
        let stepEnded = false
        let foundTopDonor = false
        const recordErrors: string[] = []

        while (!stepEnded) {
            await recordApiCall()
            const etagToSend = offset === 0 ? firstEtag : undefined
            const response = await getDonorDrive(
                `/participants/${participantId}/donors`,
                {
                    orderBy: 'sumDonations DESC',
                    limit: String(DONORDRIVE_PAGE_SIZE),
                    offset: String(offset),
                },
                etagToSend
            )

            if (offset === 0 && response.kind === 'not-modified') {
                await ctx.runMutation(internal.syncStore.recordFetch, {
                    key: donorsKey,
                    status: 304,
                })
                stepEnded = true
                break
            }
            if (response.kind === 'rate-limited') {
                const blockedUntil = Date.now() + response.retryAfterMs
                console.warn(
                    'donordrive rate limited',
                    JSON.stringify({
                        endpoint: donorsKey,
                        blocked_until: blockedUntil,
                    })
                )
                await ctx.runMutation(internal.syncStore.recordFetch, {
                    key: donorsKey,
                    status: 429,
                    error: 'rate limited',
                    blockedUntil,
                })
                pagingFailed = true
                stepEnded = true
                break
            }
            if (response.kind !== 'ok') {
                const status =
                    response.kind === 'not-modified' ? 304 : response.status
                const error =
                    response.kind === 'not-modified'
                        ? 'unexpected 304 past the first page'
                        : response.message
                console.warn(
                    'failed to fetch donordrive',
                    JSON.stringify({ endpoint: donorsKey, status, error })
                )
                await ctx.runMutation(internal.syncStore.recordFetch, {
                    key: donorsKey,
                    status,
                    error,
                })
                pagingFailed = true
                stepEnded = true
                break
            }

            if (offset === 0) firstPageEtag = response.etag
            const { records, errors, pageLength } = parseRecords(
                donorSchema,
                response.body
            )
            recordErrors.push(...errors)

            const rows: DonorRowInput[] = []
            for (const record of records) {
                const row = toDonorRow(record, campaign.year)
                if (row === null) recordErrors.push('missing donorID')
                else rows.push(row)
            }

            const upsertResult: { written: number } = await ctx.runMutation(
                internal.syncStore.upsertDonors,
                { rows }
            )
            donorsWritten += upsertResult.written

            if (!foundTopDonor && records.length > 0) {
                pull.topDonor = records[0]
                foundTopDonor = true
            }
            if (records.length > 0) {
                await ctx.runMutation(api.donorDriveDebug.add, {
                    topDonor: records[0],
                    stats: null,
                    topDonation: null,
                    latestDonations: null,
                    apiEndpoint: `GET /participants/${participantId}/donors?offset=${offset}`,
                })
            }

            if (!hasMorePages(pageLength, records.length, true)) break
            offset += DONORDRIVE_PAGE_SIZE
        }

        if (!stepEnded) {
            if (recordErrors.length > 0) {
                console.warn(
                    'skipped donordrive records',
                    JSON.stringify({
                        endpoint: donorsKey,
                        error_count: recordErrors.length,
                    })
                )
            }
            await ctx.runMutation(internal.syncStore.recordFetch, {
                key: donorsKey,
                status: 200,
                etag: pagingFailed ? undefined : firstPageEtag,
                error:
                    recordErrors.length > 0
                        ? recordErrors.join('; ')
                        : undefined,
            })
        }
    }

    console.log(
        'donordrive sync finished',
        JSON.stringify({
            participant_id: participantId,
            inserted: donationsInserted,
            donors_written: donorsWritten,
            duration_ms: Date.now() - startedAt,
        })
    )

    return pull
}

export const run = internalAction({
    args: { generation: v.optional(v.number()) },
    returns: v.null(),
    handler: async (ctx, args) => {
        const campaign: Doc<'campaigns'> | null = await ctx.runQuery(
            internal.campaigns.getActive,
            {}
        )
        if (!campaign) return null

        try {
            await performSync(ctx, campaign, { force: false })
        } catch (error) {
            console.error(
                'failed to sync donordrive',
                JSON.stringify({
                    error:
                        error instanceof Error ? error.message : String(error),
                })
            )
        } finally {
            await ctx.runMutation(internal.syncStore.finishRun, {
                participantId: campaign.participantId,
                generation: args.generation,
            })
        }
        return null
    },
})

export async function requestSync(
    ctx: MutationCtx,
    participantId: string
): Promise<void> {
    const key = `participant:${participantId}`
    const now = Date.now()
    const existing = await ctx.db
        .query('syncState')
        .withIndex('by_key', (q) => q.eq('key', key))
        .unique()

    const notInFlight =
        existing?.inFlightUntil === undefined || existing.inFlightUntil < now
    if (!notInFlight) return

    if (existing) {
        await ctx.db.patch(existing._id, {
            inFlightUntil: now + IN_FLIGHT_LEASE_MS,
        })
    } else {
        await ctx.db.insert('syncState', {
            key,
            pollGeneration: 0,
            inFlightUntil: now + IN_FLIGHT_LEASE_MS,
        })
    }

    await ctx.scheduler.runAfter(0, internal.sync.run, {})
}

// minGeneration keeps runs still scheduled under a previous participant from matching
export async function startLivePolling(
    ctx: MutationCtx,
    participantId: string,
    minGeneration = 0
): Promise<void> {
    const key = `participant:${participantId}`
    const now = Date.now()
    const existing = await ctx.db
        .query('syncState')
        .withIndex('by_key', (q) => q.eq('key', key))
        .unique()
    const generation =
        Math.max(existing?.pollGeneration ?? 0, minGeneration) + 1

    if (existing) {
        await ctx.db.patch(existing._id, {
            pollGeneration: generation,
            inFlightUntil: now + IN_FLIGHT_LEASE_MS,
        })
    } else {
        await ctx.db.insert('syncState', {
            key,
            pollGeneration: generation,
            inFlightUntil: now + IN_FLIGHT_LEASE_MS,
        })
    }

    await ctx.scheduler.runAfter(0, internal.sync.run, { generation })
}

export const request = mutation({
    args: {},
    returns: v.null(),
    handler: async (ctx) => {
        const campaign = await ctx.db
            .query('campaigns')
            .withIndex('by_active', (q) => q.eq('isActive', true))
            .unique()
        if (!campaign) return null

        await requestSync(ctx, campaign.participantId)
        return null
    },
})

export const setLivePolling = mutation({
    args: { enabled: v.boolean() },
    returns: v.null(),
    handler: async (ctx, args) => {
        const campaign = await ctx.db
            .query('campaigns')
            .withIndex('by_active', (q) => q.eq('isActive', true))
            .unique()
        if (!campaign) throw new Error('No active campaign')

        await ctx.db.patch(campaign._id, { livePolling: args.enabled })
        if (!args.enabled) return null

        await startLivePolling(ctx, campaign.participantId)
        return null
    },
})

export const forceRun = action({
    args: {},
    returns: v.object({
        participant: v.union(statsValidator, v.null()),
        latestDonations: v.array(donationValidator),
        topDonor: v.union(donorValidator, v.null()),
    }),
    handler: async (ctx) => {
        const campaign: Doc<'campaigns'> | null = await ctx.runQuery(
            internal.campaigns.getActive,
            {}
        )
        if (!campaign) throw new Error('No active campaign')

        let pull: SyncPull
        try {
            pull = await performSync(ctx, campaign, { force: true })
        } finally {
            await ctx.runMutation(internal.syncStore.finishRun, {
                participantId: campaign.participantId,
            })
        }

        return {
            participant: pull.participant,
            latestDonations: pull.latestDonations,
            topDonor: pull.topDonor,
        }
    },
})
