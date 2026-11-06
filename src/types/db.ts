import type { Id } from '@/convex/_generated/dataModel'
import type { SegmentPlatform } from '@/convex/schema/segments'

export interface Goal {
    amount: number
    endOfStream: boolean
    id: Id<'goals'>
    title: string
}

export interface Segment {
    duration: number
    id: Id<'segments'>
    platform?: SegmentPlatform
    startsAt: string
    title: string
}

export interface Rotator {
    id: Id<'rotator'>
    text: string
}

export interface RandomizerItem {
    id: Id<'randomizerItems'>
    limit: number
    name: string
    randomizerId: string
    redeemed: number
}

export interface WheelRedemption {
    createdAt: string
    id: Id<'wheelRedemptions'>
    randomizerId: string
}

export interface Randomizer {
    firstListName?: string
    id: Id<'randomizers'>
    items: RandomizerItem[]
    kind?: 'dual'
    name: string
    redemptions: WheelRedemption[]
    secondItems: RandomizerItem[]
    secondListName?: string
}
