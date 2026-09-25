'use client'

import Image from 'next/image'

import { Suspense } from 'react'
import { useDonorDrive } from '@/hooks/use-donor-drive'
import ThermometerProgressBar from './_components/thermometer-progress-bar'
import styles from './progress.module.css'

const ProgressContent = () => {
    const { isLoading, error } = useDonorDrive()

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.loadingText}>
                    Loading progress data...
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
                    Error loading progress data
                </div>
            </div>
        )
    }

    return (
        <div
            className={styles.progressRoot}
            // Enforce transparency even if CSS fails to load in OBS
            style={{ backgroundColor: 'transparent' }}
        >
            {/* Background image */}
            <div className={styles.backgroundImage}>
                <Image
                    alt='Stream Progress Background'
                    height={1080}
                    priority
                    src='/images/stream-progress.webp'
                    unoptimized
                    width={1920}
                />
            </div>

            {/* Thermometer Progress Bar Container */}
            <div className={styles.thermometerContainer}>
                <ThermometerProgressBar />
            </div>
        </div>
    )
}

const Progress = () => {
    return (
        <Suspense
            fallback={
                <div className={styles.loading}>
                    <div className={styles.loadingText}>
                        Loading progress...
                    </div>
                </div>
            }
        >
            <ProgressContent />
        </Suspense>
    )
}

export default Progress
