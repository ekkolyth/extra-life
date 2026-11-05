import { v } from 'convex/values'
import { internal } from './_generated/api'
import { internalMutation, internalQuery } from './_generated/server'
import { shouldQueueAlert } from './lib/donationAlerts'
import type { CampaignFields, DonorRowInput } from './lib/donordrive'
import { campaignFields } from './schema/campaigns'
import { donationFields } from './schema/donations'
import { donorFields } from './schema/donors'
import { syncStateDoc } from './schema/syncState'

const campaignFieldsInput = v.object({
    eventId: campaignFields.eventId,
    eventName: campaignFields.eventName,
    displayName: campaignFields.displayName,
    avatarImageURL: campaignFields.avatarImageURL,
    fundraisingGoal: campaignFields.fundraisingGoal,
    streamIsEnabled: campaignFields.streamIsEnabled,
    streamingChannel: campaignFields.streamingChannel,
    streamingPlatform: campaignFields.streamingPlatform,
    sumDonations: campaignFields.sumDonations,
    sumPledges: campaignFields.sumPledges,
    numDonations: campaignFields.numDonations,
    streamIsLive: campaignFields.streamIsLive,
})

const donationRowInput = v.object({
    year: donationFields.year,
    donationID: donationFields.donationID,
    participantId: donationFields.participantId,
    donorID: donationFields.donorID,
    displayName: donationFields.displayName,
    amount: donationFields.amount,
    message: donationFields.message,
    avatarImageURL: donationFields.avatarImageURL,
    email: donationFields.email,
    isRegFee: donationFields.isRegFee,
    createdAt: donationFields.createdAt,
    source: donationFields.source,
})

const donorRowInput = v.object({
    year: donorFields.year,
    donorID: donorFields.donorID,
    displayName: donorFields.displayName,
    avatarImageURL: donorFields.avatarImageURL,
    sumDonations: donorFields.sumDonations,
    numDonations: donorFields.numDonations,
    modifiedAt: donorFields.modifiedAt,
})

export const loadStates = internalQuery({
    args: { participantId: v.string() },
    returns: v.object({
        participant: v.union(syncStateDoc, v.null()),
        donations: v.union(syncStateDoc, v.null()),
        donors: v.union(syncStateDoc, v.null()),
    }),
    handler: async (ctx, args) => {
        const [participant, donations, donors] = await Promise.all([
            ctx.db
                .query('syncState')
                .withIndex('by_key', (q) =>
                    q.eq('key', `participant:${args.participantId}`)
                )
                .unique(),
            ctx.db
                .query('syncState')
                .withIndex('by_key', (q) =>
                    q.eq('key', `donations:${args.participantId}`)
                )
                .unique(),
            ctx.db
                .query('syncState')
                .withIndex('by_key', (q) =>
                    q.eq('key', `donors:${args.participantId}`)
                )
                .unique(),
        ])
        return { participant, donations, donors }
    },
})

export const knownDonationIds = internalQuery({
    args: { ids: v.array(v.string()) },
    returns: v.array(v.string()),
    handler: async (ctx, args) => {
        const known: string[] = []
        for (const id of args.ids) {
            const row = await ctx.db
                .query('donations')
                .withIndex('by_donation_id', (q) => q.eq('donationID', id))
                .unique()
            if (row) known.push(id)
        }
        return known
    },
})

export const applyParticipant = internalMutation({
    args: { campaignId: v.id('campaigns'), fields: campaignFieldsInput },
    returns: v.null(),
    handler: async (ctx, args) => {
        const campaign = await ctx.db.get(args.campaignId)
        if (!campaign) return null
        const fields = args.fields
        const patch: Partial<CampaignFields> = {}
        if (campaign.eventId !== fields.eventId) patch.eventId = fields.eventId
        if (campaign.eventName !== fields.eventName)
            patch.eventName = fields.eventName
        if (campaign.displayName !== fields.displayName)
            patch.displayName = fields.displayName
        if (campaign.avatarImageURL !== fields.avatarImageURL)
            patch.avatarImageURL = fields.avatarImageURL
        if (campaign.fundraisingGoal !== fields.fundraisingGoal)
            patch.fundraisingGoal = fields.fundraisingGoal
        if (campaign.streamIsEnabled !== fields.streamIsEnabled)
            patch.streamIsEnabled = fields.streamIsEnabled
        if (campaign.streamingChannel !== fields.streamingChannel)
            patch.streamingChannel = fields.streamingChannel
        if (campaign.streamingPlatform !== fields.streamingPlatform)
            patch.streamingPlatform = fields.streamingPlatform
        if (campaign.sumDonations !== fields.sumDonations)
            patch.sumDonations = fields.sumDonations
        if (campaign.sumPledges !== fields.sumPledges)
            patch.sumPledges = fields.sumPledges
        if (campaign.numDonations !== fields.numDonations)
            patch.numDonations = fields.numDonations
        if (campaign.streamIsLive !== fields.streamIsLive)
            patch.streamIsLive = fields.streamIsLive
        await ctx.db.patch(args.campaignId, {
            ...patch,
            lastSyncedAt: Date.now(),
        })
        return null
    },
})

export const insertDonations = internalMutation({
    args: { rows: v.array(donationRowInput) },
    returns: v.object({ inserted: v.number() }),
    handler: async (ctx, args) => {
        const campaign = await ctx.db
            .query('campaigns')
            .withIndex('by_active', (q) => q.eq('isActive', true))
            .unique()
        // stream alerts only run while live polling is on
        const alertsOn = campaign?.livePolling === true
        const now = Date.now()

        let inserted = 0
        for (const row of args.rows) {
            const existing = await ctx.db
                .query('donations')
                .withIndex('by_donation_id', (q) =>
                    q.eq('donationID', row.donationID)
                )
                .unique()
            if (existing) continue
            const donationId = await ctx.db.insert('donations', row)
            inserted++

            if (alertsOn && shouldQueueAlert(row, now)) {
                await ctx.db.insert('donationAlerts', {
                    donationId,
                    displayName: row.displayName,
                    amount: row.amount,
                    message: row.message,
                })
            }
        }
        return { inserted }
    },
})

export const upsertDonors = internalMutation({
    args: { rows: v.array(donorRowInput) },
    returns: v.object({ written: v.number() }),
    handler: async (ctx, args) => {
        let written = 0
        for (const row of args.rows) {
            const existing = await ctx.db
                .query('donors')
                .withIndex('by_year_donor', (q) =>
                    q.eq('year', row.year).eq('donorID', row.donorID)
                )
                .unique()
            if (!existing) {
                await ctx.db.insert('donors', row)
                written++
                continue
            }
            const patch: Partial<DonorRowInput> = {}
            if (existing.displayName !== row.displayName)
                patch.displayName = row.displayName
            if (existing.avatarImageURL !== row.avatarImageURL)
                patch.avatarImageURL = row.avatarImageURL
            if (existing.sumDonations !== row.sumDonations)
                patch.sumDonations = row.sumDonations
            if (existing.numDonations !== row.numDonations)
                patch.numDonations = row.numDonations
            if (existing.modifiedAt !== row.modifiedAt)
                patch.modifiedAt = row.modifiedAt
            if (Object.keys(patch).length > 0) {
                await ctx.db.patch(existing._id, patch)
                written++
            }
        }
        return { written }
    },
})

export const recordFetch = internalMutation({
    args: {
        key: v.string(),
        status: v.optional(v.number()),
        etag: v.optional(v.string()),
        error: v.optional(v.string()),
        blockedUntil: v.optional(v.number()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query('syncState')
            .withIndex('by_key', (q) => q.eq('key', args.key))
            .unique()
        const success =
            !args.error && (args.status === 200 || args.status === 304)

        if (existing) {
            await ctx.db.patch(existing._id, {
                lastFetchedAt: Date.now(),
                lastStatus: args.status,
                etag: success ? (args.etag ?? existing.etag) : existing.etag,
                lastError: success
                    ? undefined
                    : (args.error ?? existing.lastError),
                blockedUntil: args.blockedUntil ?? existing.blockedUntil,
            })
            return null
        }

        await ctx.db.insert('syncState', {
            key: args.key,
            pollGeneration: 0,
            lastFetchedAt: Date.now(),
            ...(args.status !== undefined ? { lastStatus: args.status } : {}),
            ...(success && args.etag !== undefined ? { etag: args.etag } : {}),
            ...(!success && args.error !== undefined
                ? { lastError: args.error }
                : {}),
            ...(args.blockedUntil !== undefined
                ? { blockedUntil: args.blockedUntil }
                : {}),
        })
        return null
    },
})

export const finishRun = internalMutation({
    args: { participantId: v.string(), generation: v.optional(v.number()) },
    returns: v.null(),
    handler: async (ctx, args) => {
        const key = `participant:${args.participantId}`
        const cooldownUntil = Date.now() + 15_000
        const existing = await ctx.db
            .query('syncState')
            .withIndex('by_key', (q) => q.eq('key', key))
            .unique()
        if (existing) {
            await ctx.db.patch(existing._id, { inFlightUntil: cooldownUntil })
        } else {
            await ctx.db.insert('syncState', {
                key,
                pollGeneration: 0,
                inFlightUntil: cooldownUntil,
            })
        }
        if (args.generation === undefined || !existing) return null

        const campaign = await ctx.db
            .query('campaigns')
            .withIndex('by_active', (q) => q.eq('isActive', true))
            .unique()
        if (!campaign?.livePolling) return null
        if (args.generation === existing.pollGeneration) {
            await ctx.scheduler.runAfter(15_000, internal.sync.run, {
                generation: args.generation,
            })
        }
        return null
    },
})
