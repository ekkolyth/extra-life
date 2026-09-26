import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/convex/_generated/api'

export function useTopDonor() {
    const { data: campaign } = useQuery(convexQuery(api.campaigns.active, {}))

    return useQuery(
        convexQuery(api.donors.top, campaign ? { year: campaign.year } : 'skip')
    )
}
