import { defineTable } from 'convex/server'
import { v } from 'convex/values'

export const donorFields = {
    year: v.number(),
    donorID: v.string(),
    displayName: v.optional(v.string()),
    avatarImageURL: v.optional(v.string()),
    sumDonations: v.number(),
    numDonations: v.number(),
    modifiedAt: v.number(),
}

export const donors = defineTable(donorFields)
    .index('by_year_donor', ['year', 'donorID'])
    .index('by_year_sum', ['year', 'sumDonations'])

export const donorDoc = v.object({
    _id: v.id('donors'),
    _creationTime: v.number(),
    ...donorFields,
})
