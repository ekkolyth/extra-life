import { defineTable } from 'convex/server'
import { v } from 'convex/values'

export const donationAlertFields = {
    // unset on a test alert from /debug
    donationId: v.optional(v.id('donations')),
    displayName: v.optional(v.string()),
    amount: v.number(),
    message: v.optional(v.string()),
    // unset while the overlay still has to play it
    playedAt: v.optional(v.number()),
}

export const donationAlerts = defineTable(donationAlertFields).index(
    'by_played_at',
    ['playedAt']
)
