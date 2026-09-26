'use client'

import { useConvexQuery } from '@convex-dev/react-query'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { api } from '@/convex/_generated/api'
import { useCampaign } from '@/hooks/use-campaign'
import { useDonationVideoTrigger } from '@/hooks/use-donation-video-trigger'
import { useLatestDonations } from '@/hooks/use-donations'
import { useTopDonor } from '@/hooks/use-top-donor'
import type { OverlayData } from '@/types/donor-drive'
import { DonationVideoOverlay } from './_components/donation-video-overlay'
import ProgressBar from './_components/progress-bar'
import { Randomizer } from './_components/randomizer'
import TopRotator from './_components/top-rotator'
import styles from './overlay.module.css'

const OverlayContent = () => {
    const searchParams = useSearchParams()
    const limited = searchParams.get('limited') === 'true'

    const [confetti, setConfetti] = useState(false)

    const { data: campaign, isPending, error } = useCampaign()
    const { data: latestDonations = [] } = useLatestDonations(10)
    const { data: topDonor = null } = useTopDonor()

    const sumDonations = campaign?.sumDonations ?? 0
    const fundraisingGoal = campaign?.fundraisingGoal || 2000

    const overlayData: OverlayData = { sumDonations, latestDonations, topDonor }

    // Goals from Convex
    const convexGoals = useConvexQuery(api.goals.list, {})

    // Infer the element type so we never use `any`
    type Goal = NonNullable<typeof convexGoals>[number]

    const goals = (convexGoals ?? []).map((g: Goal) => ({
        id: g._id,
        title: g.title,
        amount: g.amount,
        endOfStream: g.endOfStream,
    }))

    // Big-donation video trigger
    const { shouldPlayVideo, currentDonation, handleVideoEnd } =
        useDonationVideoTrigger({
            latestDonations,
            threshold: 100,
            timeWindowSeconds: 15,
        })

    // Debug video trigger
    const [showTestVideo, setShowTestVideo] = useState(false)
    useEffect(() => {
        const checkForTestTrigger = async () => {
            try {
                const response = await fetch('/api/test-video')
                const data = await response.json()
                if (data.triggered) setShowTestVideo(true)
            } catch {}
        }
        const interval = setInterval(checkForTestTrigger, 500)
        return () => clearInterval(interval)
    }, [])

    // Confetti when >= 100%
    useEffect(() => {
        const pct = (sumDonations / fundraisingGoal) * 100
        if (pct >= 100 && !confetti) {
            setConfetti(true)
            const t = setTimeout(() => setConfetti(false), 30000)
            return () => clearTimeout(t)
        }
    }, [sumDonations, fundraisingGoal, confetti])

    if (isPending) {
        return (
            <div className={styles.loading}>
                <div className={styles.loadingText}>
                    Loading overlay data...
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className={styles.loading}>
                <div
                    className={styles.loadingText}
                    style={{ color: '#ef4444' }}
                >
                    Error loading overlay data
                </div>
            </div>
        )
    }

    return (
        <div
            className={styles.overlayRoot}
            // Enforce transparency even if CSS fails to load in OBS
            style={{ backgroundColor: 'transparent' }}
        >
            {/* Donation Video Overlay */}
            <DonationVideoOverlay
                donation={currentDonation}
                isVisible={shouldPlayVideo}
                onVideoEnd={handleVideoEnd}
            />

            {/* Test Video Overlay */}
            <DonationVideoOverlay
                donation={{
                    amount: 250.0,
                    displayName: 'Anonymous',
                    message: 'For the kids!',
                    createdAt: Date.now(),
                }}
                isVisible={showTestVideo}
                onVideoEnd={() => setShowTestVideo(false)}
            />

            {/* Confetti */}
            {!limited && confetti && <div className={styles.confettiLayer} />}

            {/* Top Rotator */}
            {!limited && (
                <div className={styles.topRotatorWrap}>
                    <TopRotator data={overlayData} goals={goals} />
                </div>
            )}

            {/* Progress Bar */}
            {!limited && (
                <div className={styles.progressbarWrap}>
                    {/* Pass explicit hex colors & inline fallback styles so OBS can’t misinterpret vars */}
                    <ProgressBar
                        borderColor='rgba(0,0,0,0.35)'
                        borderWidth={4}
                        fillColor='#25a8f1'
                        height={64}
                        textColor='#ffffff'
                        trackColor='#1e3b52'
                        width={960}
                    />
                </div>
            )}

            {/* Randomizer View */}
            {!limited && <Randomizer setConfetti={setConfetti} />}
        </div>
    )
}

const Overlay = () => {
    return (
        <Suspense
            fallback={
                <div className={styles.loading}>
                    <div className={styles.loadingText}>Loading overlay...</div>
                </div>
            }
        >
            <OverlayContent />
        </Suspense>
    )
}

export default Overlay
