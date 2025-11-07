'use client';

import styles from './progress.module.css';

import { Suspense } from 'react';
import { useDonorDrive } from '@/hooks/useDonorDrive';
import ThermometerProgressBar from './_components/thermometer-progress-bar';
import Image from 'next/image';

const ProgressContent = () => {
  const { data: donorDriveData, isLoading, error } = useDonorDrive();

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingText}>Loading progress data...</div>
      </div>
    );
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
    );
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
          src="/images/stream-progress.webp"
          alt="Stream Progress Background"
          width={1920}
          height={1080}
          priority
          unoptimized
        />
      </div>

      {/* Thermometer Progress Bar Container */}
      <div className={styles.thermometerContainer}>
        <ThermometerProgressBar fillColor="#ef4444" />
      </div>
    </div>
  );
};

const Progress = () => {
  return (
    <Suspense
      fallback={
        <div className={styles.loading}>
          <div className={styles.loadingText}>Loading progress...</div>
        </div>
      }
    >
      <ProgressContent />
    </Suspense>
  );
};

export default Progress;
