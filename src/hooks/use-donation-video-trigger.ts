import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'

export function useDonationVideoTrigger() {
    const { data: pending, error } = useQuery({
        ...convexQuery(api.donationAlerts.pending, {}),
        // the subscription bridge drops recovery updates if the cache has never held data
        initialData: [],
    })
    const markPlayed = useConvexMutation(api.donationAlerts.markPlayed)
    // hide a finished alert right away instead of waiting for the subscription to drop it
    const [finished, setFinished] = useState<Set<Id<'donationAlerts'>>>(
        new Set()
    )

    const currentAlert =
        pending.find((alert) => !finished.has(alert._id)) ?? null

    const handleVideoEnd = () => {
        if (!currentAlert) return
        const alertId = currentAlert._id
        setFinished((prev) => new Set(prev).add(alertId))
        markPlayed({ alertId }).catch((error: unknown) => {
            console.error('failed to mark alert played', error)
        })
    }

    return { currentAlert, handleVideoEnd, error }
}
