import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/convex/_generated/api'

function useLatestDonations(limit: number) {
    const { data: campaign } = useQuery(convexQuery(api.campaigns.active, {}))

    return useQuery(
        convexQuery(
            api.donations.latest,
            campaign ? { year: campaign.year, limit } : 'skip'
        )
    )
}

// defaults to the active campaign's year
function useAllDonations(year?: number) {
    const { data: campaign } = useQuery(convexQuery(api.campaigns.active, {}))
    const targetYear = year ?? campaign?.year

    return useQuery(
        convexQuery(
            api.donations.list,
            targetYear === undefined ? 'skip' : { year: targetYear }
        )
    )
}

export { useAllDonations, useLatestDonations }
