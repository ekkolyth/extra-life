import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { api } from '@/convex/_generated/api'

export function useCampaign() {
    const { mutate: requestSync } = useMutation({
        mutationFn: useConvexMutation(api.sync.request),
    })

    // a page load is what triggers a pull while live polling is off
    useEffect(() => {
        requestSync({})
    }, [requestSync])

    return useQuery(convexQuery(api.campaigns.active, {}))
}
