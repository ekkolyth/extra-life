'use client'

import { useEffect, useRef, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { Donation as FullDonation } from '@/types/donor-drive'

type Donation = Pick<FullDonation, 'amount' | 'displayName' | 'message'>

interface DonationVideoOverlayProps {
    donation: Donation | null
    isVisible: boolean
    onVideoEnd: () => void
}

export function DonationVideoOverlay({
    isVisible,
    donation,
    onVideoEnd,
}: DonationVideoOverlayProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [hasPlayed, setHasPlayed] = useState(false)
    const [playbackError, setPlaybackError] = useState(false)

    useEffect(() => {
        if (isVisible && videoRef.current && !hasPlayed) {
            const video = videoRef.current

            // Reset video to beginning
            video.currentTime = 0

            // Play the video
            video.play().catch((error) => {
                console.error('Error playing donation video:', error)
                setPlaybackError(true)
            })

            setHasPlayed(true)
        }
    }, [isVisible, hasPlayed])

    // Reset hasPlayed when overlay becomes invisible
    useEffect(() => {
        if (!isVisible) {
            setHasPlayed(false)
            setPlaybackError(false)
        }
    }, [isVisible])

    const handleVideoEnd = () => {
        setHasPlayed(false)
        onVideoEnd()
    }

    if (!isVisible || !donation) {
        return null
    }

    return (
        <div className='fixed inset-0 z-50 bg-transparent'>
            <video
                className='w-full h-full object-cover'
                muted={false} // Enable audio
                onEnded={handleVideoEnd}
                onError={() => {
                    console.error('Video playback error')
                    setPlaybackError(true)
                }}
                playsInline
                preload='auto'
                ref={videoRef}
            >
                <source src='/videos/alert.webm' type='video/webm' />
                Your browser does not support the video tag.
            </video>

            {playbackError && (
                <Alert className='absolute top-8 right-8' variant='destructive'>
                    <AlertDescription>
                        Error playing donation video
                    </AlertDescription>
                </Alert>
            )}

            {/* Donation Details Overlay */}
            <div className='absolute top-8 left-8 pointer-events-none'>
                <div className='text-left text-white bg-black/50 backdrop-blur-sm rounded-2xl p-8 max-w-2xl'>
                    <h2 className='text-5xl font-bold mb-6 text-white drop-shadow-2xl'>
                        {donation.displayName || 'Anonymous'}
                    </h2>
                    <div className='text-4xl font-bold mb-6 text-primary drop-shadow-2xl'>
                        ${donation.amount.toFixed(2)}
                    </div>
                    {donation.message && (
                        <div className='text-2xl font-medium text-white drop-shadow-2xl'>
                            &ldquo;{donation.message}&rdquo;
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
