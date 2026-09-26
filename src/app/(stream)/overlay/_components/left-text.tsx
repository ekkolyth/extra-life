'use client'

import { useConvexQuery } from '@convex-dev/react-query'
import { useEffect, useState } from 'react'
import { api } from '@/convex/_generated/api'
import type { OverlayData } from '@/types/donor-drive'

interface LeftTextProps {
    data: OverlayData
}

export function LeftText(_props: LeftTextProps) {
    const [rotating, setRotating] = useState(false)
    const [index, setIndex] = useState(0)

    // Use Convex to fetch rotators from the database
    const rotators = useConvexQuery(api.rotator.list, {}) || []

    const length = rotators.length
    const visibleIndex = index % length

    useEffect(() => {
        setRotating(true)
        const interval = setInterval(() => setIndex((index) => index + 1), 7000)
        return () => clearInterval(interval)
    }, [])

    // Fallback text if no rotators are available
    const fallbackText = 'Change Kids Health. Change the Future.'

    return (
        <div>
            <p className='text-white font-bold text-2xl truncate'>
                {rotating
                    ? rotators[visibleIndex]?.text || fallbackText
                    : fallbackText}
            </p>
        </div>
    )
}
