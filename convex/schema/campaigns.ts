import { defineTable } from 'convex/server'
import { v } from 'convex/values'

export const campaignFields = {
    year: v.number(),
    participantId: v.string(),
    eventId: v.number(),
    eventName: v.string(),
    displayName: v.string(),
    avatarImageURL: v.string(),
    fundraisingGoal: v.number(),
    streamIsEnabled: v.boolean(),
    streamingChannel: v.string(),
    streamingPlatform: v.string(),
    sumDonations: v.number(),
    sumPledges: v.number(),
    numDonations: v.number(),
    streamIsLive: v.boolean(),
    isActive: v.boolean(),
    livePolling: v.boolean(),
    lastSyncedAt: v.optional(v.number()),
}

export const campaigns = defineTable(campaignFields)
    .index('by_year', ['year'])
    .index('by_participant', ['participantId'])
    .index('by_active', ['isActive'])

export const campaignDoc = v.object({
    _id: v.id('campaigns'),
    _creationTime: v.number(),
    ...campaignFields,
})
