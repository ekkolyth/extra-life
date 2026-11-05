import { defineTable } from 'convex/server'
import { v } from 'convex/values'

export const donationFields = {
    year: v.number(),
    donationID: v.string(),
    participantId: v.optional(v.string()),
    donorID: v.optional(v.string()),
    displayName: v.optional(v.string()),
    amount: v.number(),
    message: v.optional(v.string()),
    avatarImageURL: v.optional(v.string()),
    email: v.optional(v.string()),
    isRegFee: v.boolean(),
    createdAt: v.number(),
    source: v.union(v.literal('api'), v.literal('backfill'), v.literal('csv')),
}

export const donations = defineTable(donationFields)
    .index('by_donation_id', ['donationID'])
    .index('by_year_created', ['year', 'createdAt'])

export const donationDoc = v.object({
    _id: v.id('donations'),
    _creationTime: v.number(),
    ...donationFields,
})
