import type { Id } from '@/convex/_generated/dataModel'

export interface Goal {
    amount: number
    endOfStream: boolean
    id: Id<'goals'>
    title: string
}

export interface Segment {
    duration: number
    id: Id<'segments'>
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
    id: Id<'randomizers'>
    items: RandomizerItem[]
    name: string
    redemptions: WheelRedemption[]
}
