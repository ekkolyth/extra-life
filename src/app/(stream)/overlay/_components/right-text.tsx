'use client'

import { convexQuery, useConvexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { api } from '@/convex/_generated/api'
import { formatTimeLeft } from '@/lib/time-left'
import type { Goal } from '@/types/db'
import type { OverlayData } from '@/types/donor-drive'
import { useSegments } from '@/utils/use-segments'

interface TopRotatorProps {
    data: OverlayData
    goals: Goal[]
}

export function RightText(props: TopRotatorProps) {
    const { goals, data } = props
    const [index, setIndex] = useState(0)
    const [nextGoal, setNextGoal] = useState<Goal | null>(null)
    const [timeLeft, setTimeLeft] = useState<string | null>(null)
    const { data: campaign } = useQuery(convexQuery(api.campaigns.active, {}))
    const streamEndsAt = campaign?.streamEndsAt

    // Use the data passed from parent
    const combinedData = data

    // Use Convex for database queries
    const convexSegments = useConvexQuery(api.segment.list, {}) || []
    const segments = convexSegments.map(
        (s: NonNullable<typeof convexSegments>[number]) => ({
            id: s._id,
            title: s.title,
            startsAt: s.startsAt,
            duration: s.duration,
        })
    )
    const { currentSegment, nextSegment } = useSegments(segments)

    useEffect(() => {
        if (combinedData && goals?.length) {
            setNextGoal(
                goals.find((goal) => goal.amount > combinedData.sumDonations) ??
                    null
            )
        }
    }, [combinedData, goals])

    useEffect(() => {
        if (streamEndsAt === undefined) {
            setTimeLeft(null)
            return
        }
        const updateCountdown = () =>
            setTimeLeft(formatTimeLeft(streamEndsAt - Date.now()))
        updateCountdown()
        const interval = setInterval(updateCountdown, 1000)
        return () => clearInterval(interval)
    }, [streamEndsAt])

    // Memoize bonusText to prevent recreation on every render
    const bonusText = useMemo(
        () => [
            {
                label: 'right now',
                text: currentSegment?.title ?? '',
            },
            {
                label: 'up next',
                text: nextSegment?.title ?? '',
            },
            {
                label: 'top donation',
                text:
                    combinedData.latestDonations.length > 0
                        ? `${combinedData.latestDonations[0]?.displayName ?? 'Anonymous'} - $${
                              combinedData.latestDonations[0]?.amount ?? 0
                          }`
                        : '',
            },
            {
                label: 'top donator',
                text: combinedData.topDonor
                    ? `${combinedData.topDonor.displayName}`
                    : '',
            },
            {
                label: 'next goal unlock',
                text: nextGoal
                    ? `${nextGoal?.title}${nextGoal?.endOfStream ? ` - End Of Stream` : ''}`
                    : '',
            },
            // hidden until an end time is set in settings
            ...(timeLeft === null
                ? []
                : [{ label: 'time left', text: timeLeft }]),
        ],
        [
            currentSegment,
            nextSegment,
            combinedData.latestDonations,
            combinedData.topDonor,
            nextGoal,
            timeLeft,
        ]
    )

    const visibleIndex = index % bonusText.length

    // Every 7 seconds increment the index
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => prevIndex + 1)
        }, 7000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className='flex-grow flex justify-end py-1'>
            <div className='text-right'>
                <p className='text-2xl font-bold text-white -mb-1'>
                    {bonusText[visibleIndex].label}
                </p>
                <p className='text-2xl font-bold text-white truncate'>
                    {bonusText[visibleIndex].text}
                </p>
            </div>
        </div>
    )
}
