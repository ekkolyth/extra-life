import { v } from 'convex/values'
import {
    internalMutation,
    internalQuery,
    mutation,
    query,
} from './_generated/server'
import { campaignDoc } from './schema/campaigns'
import { requestSync, startLivePolling } from './sync'

export const register = internalMutation({
    args: {
        year: v.number(),
        participantId: v.string(),
        activate: v.optional(v.boolean()),
    },
    returns: v.id('campaigns'),
    handler: async (ctx, args) => {
        const existingYear = await ctx.db
            .query('campaigns')
            .withIndex('by_year', (q) => q.eq('year', args.year))
            .first()
        if (existingYear) {
            throw new Error(`Campaign for ${args.year} already exists`)
        }

        const existingParticipant = await ctx.db
            .query('campaigns')
            .withIndex('by_participant', (q) =>
                q.eq('participantId', args.participantId)
            )
            .first()
        if (existingParticipant) {
            throw new Error(
                `Participant ${args.participantId} is already registered`
            )
        }

        const activate = args.activate === true

        if (activate) {
            const activeCampaigns = await ctx.db
                .query('campaigns')
                .withIndex('by_active', (q) => q.eq('isActive', true))
                .collect()
            for (const campaign of activeCampaigns) {
                await ctx.db.patch(campaign._id, { isActive: false })
            }
        }

        return await ctx.db.insert('campaigns', {
            year: args.year,
            participantId: args.participantId,
            eventId: 0,
            eventName: '',
            displayName: '',
            avatarImageURL: '',
            fundraisingGoal: 0,
            streamIsEnabled: false,
            streamingChannel: '',
            streamingPlatform: '',
            sumDonations: 0,
            sumPledges: 0,
            numDonations: 0,
            streamIsLive: false,
            isActive: activate,
            livePolling: false,
        })
    },
})

export const active = query({
    args: {},
    returns: v.union(campaignDoc, v.null()),
    handler: async (ctx) => {
        return await ctx.db
            .query('campaigns')
            .withIndex('by_active', (q) => q.eq('isActive', true))
            .unique()
    },
})

export const getActive = internalQuery({
    args: {},
    returns: v.union(campaignDoc, v.null()),
    handler: async (ctx) => {
        return await ctx.db
            .query('campaigns')
            .withIndex('by_active', (q) => q.eq('isActive', true))
            .unique()
    },
})

export const setParticipantId = mutation({
    args: { participantId: v.string() },
    returns: v.null(),
    handler: async (ctx, args) => {
        const participantId = args.participantId.trim()
        if (participantId === '') throw new Error('Participant ID is required')

        const campaign = await ctx.db
            .query('campaigns')
            .withIndex('by_active', (q) => q.eq('isActive', true))
            .unique()
        if (!campaign) throw new Error('No active campaign')
        if (campaign.participantId === participantId) return null

        const existingParticipant = await ctx.db
            .query('campaigns')
            .withIndex('by_participant', (q) =>
                q.eq('participantId', participantId)
            )
            .first()
        if (existingParticipant) {
            throw new Error(
                `Participant ${participantId} is already registered`
            )
        }

        await ctx.db.patch(campaign._id, { participantId })

        if (!campaign.livePolling) {
            await requestSync(ctx, participantId)
            return null
        }

        // the polling loop is keyed by participant, so retire the old loop and start one for the new id
        const previous = await ctx.db
            .query('syncState')
            .withIndex('by_key', (q) =>
                q.eq('key', `participant:${campaign.participantId}`)
            )
            .unique()
        const retiredGeneration = (previous?.pollGeneration ?? 0) + 1
        if (previous) {
            await ctx.db.patch(previous._id, {
                pollGeneration: retiredGeneration,
            })
        }
        await startLivePolling(ctx, participantId, retiredGeneration)
        return null
    },
})
