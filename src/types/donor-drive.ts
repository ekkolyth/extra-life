import type { Doc } from '@/convex/_generated/dataModel'

export type Campaign = Doc<'campaigns'>
export type Donation = Doc<'donations'>
export type Donor = Doc<'donors'>

export type OverlayData = {
    sumDonations: number
    latestDonations: Donation[]
    topDonor: Donor | null
}
