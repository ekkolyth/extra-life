import { defineTable } from 'convex/server'
import { v } from 'convex/values'

export const syncStateFields = {
    key: v.string(),
    etag: v.optional(v.string()),
    lastFetchedAt: v.optional(v.number()),
    lastStatus: v.optional(v.number()),
    lastError: v.optional(v.string()),
    blockedUntil: v.optional(v.number()),
    inFlightUntil: v.optional(v.number()),
    pollGeneration: v.number(),
}

export const syncState = defineTable(syncStateFields).index('by_key', ['key'])

export const syncStateDoc = v.object({
    _id: v.id('syncState'),
    _creationTime: v.number(),
    ...syncStateFields,
})
