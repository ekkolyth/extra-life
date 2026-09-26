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

function useAllDonations() {
    const { data: campaign } = useQuery(convexQuery(api.campaigns.active, {}))

    return useQuery(
        convexQuery(
            api.donations.list,
            campaign ? { year: campaign.year } : 'skip'
        )
    )
}

export { useAllDonations, useLatestDonations }
