import { v } from 'convex/values'
import { api, internal } from './_generated/api'
import type { Doc } from './_generated/dataModel'
import type { ActionCtx } from './_generated/server'
import { internalAction } from './_generated/server'
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
    options: { force: boolean }
): Promise<SyncPull> {
    const startedAt = Date.now()
    const pull: SyncPull = {
        participantId: null,
        participant: null,
        latestDonations: [],
        topDonor: null,
    }
    let donationsInserted = 0
    let donorsWritten = 0

    const campaign: Doc<'campaigns'> | null = await ctx.runQuery(
        internal.campaigns.getActive,
        {}
    )
    if (!campaign) return pull

    const participantId = campaign.participantId
    pull.participantId = participantId

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
            await ctx.runMutation(internal.syncStore.recordFetch, {
                key: participantKey,
                status: 429,
                error: 'rate limited',
                blockedUntil: Date.now() + response.retryAfterMs,
            })
        } else {
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
        let offset = 0
        let firstPageEtag: string | undefined
        let pagingFailed = false
        let stepEnded = false
        const recordErrors: string[] = []

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
                await ctx.runMutation(internal.syncStore.recordFetch, {
                    key: donationsKey,
                    status: 429,
                    error: 'rate limited',
                    blockedUntil: Date.now() + response.retryAfterMs,
                })
                pagingFailed = true
                stepEnded = true
                break
            }
            if (response.kind !== 'ok') {
                await ctx.runMutation(internal.syncStore.recordFetch, {
                    key: donationsKey,
                    status:
                        response.kind === 'not-modified'
                            ? 304
                            : response.status,
                    error:
                        response.kind === 'not-modified'
                            ? 'unexpected 304 past the first page'
                            : response.message,
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
                    recordErrors.push('missing donationID or createdDateUTC')
                else rows.push(row)
            }

            const known: string[] = await ctx.runQuery(
                internal.syncStore.knownDonationIds,
                { ids: rows.map((row) => row.donationID) }
            )
            const { fresh, hitKnown } = splitPage(rows, new Set(known))
            const insertResult: { inserted: number } = await ctx.runMutation(
                internal.syncStore.insertDonations,
                { rows: fresh }
            )
            donationsInserted += insertResult.inserted

            if (offset === 0) pull.latestDonations = records.slice(0, 10)

            await ctx.runMutation(api.donorDriveDebug.add, {
                latestDonations: records,
                stats: null,
                topDonation: null,
                topDonor: null,
                apiEndpoint: `GET /participants/${participantId}/donations?offset=${offset}`,
            })

            if (!hasMorePages(pageLength, hitKnown)) break
            offset += DONORDRIVE_PAGE_SIZE
        }

        if (!stepEnded) {
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
                await ctx.runMutation(internal.syncStore.recordFetch, {
                    key: donorsKey,
                    status: 429,
                    error: 'rate limited',
                    blockedUntil: Date.now() + response.retryAfterMs,
                })
                pagingFailed = true
                stepEnded = true
                break
            }
            if (response.kind !== 'ok') {
                await ctx.runMutation(internal.syncStore.recordFetch, {
                    key: donorsKey,
                    status:
                        response.kind === 'not-modified'
                            ? 304
                            : response.status,
                    error:
                        response.kind === 'not-modified'
                            ? 'unexpected 304 past the first page'
                            : response.message,
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

            if (!hasMorePages(pageLength, false)) break
            offset += DONORDRIVE_PAGE_SIZE
        }

        if (!stepEnded) {
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
        let participantId: string | null = null
        try {
            const pull: SyncPull = await performSync(ctx, { force: false })
            participantId = pull.participantId
        } catch (error) {
            console.error(
                'failed to sync donordrive',
                JSON.stringify({
                    error:
                        error instanceof Error ? error.message : String(error),
                })
            )
        } finally {
            if (participantId !== null) {
                await ctx.runMutation(internal.syncStore.finishRun, {
                    participantId,
                    generation: args.generation,
                })
            }
        }
        return null
    },
})
