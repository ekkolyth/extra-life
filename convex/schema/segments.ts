import { defineTable } from 'convex/server'
import { type Infer, v } from 'convex/values'

export const segmentPlatforms = [
    'Podcast Set',
    'Xbox',
    'Switch',
    'PS4',
    'PC',
] as const

export const segmentPlatform = v.union(
    v.literal('Podcast Set'),
    v.literal('Xbox'),
    v.literal('Switch'),
    v.literal('PS4'),
    v.literal('PC')
)

export type SegmentPlatform = Infer<typeof segmentPlatform>

export const segments = defineTable({
    title: v.string(),
    startsAt: v.string(),
    duration: v.number(),
    // Optional so segments created before platforms existed still validate.
    platform: v.optional(segmentPlatform),
}).index('by_title', ['title'])
