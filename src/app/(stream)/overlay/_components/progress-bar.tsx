'use client';

import { CSSProperties } from 'react';
import { useDonorDrive } from '@/hooks/useDonorDrive';

type ProgressBarProps = {
  /** Track (background) color */
  trackColor?: string;
  /** Fill (progress) color */
  fillColor?: string;
  /** Center text color */
  textColor?: string;
  /** Outer width in px */
  width?: number;
  /** Outer height in px */
  height?: number;
  /** Extra inline styles merged into the outer wrapper */
  style?: CSSProperties;
  /** Optional className if you really want to target it */
  className?: string;
};

export default function ProgressBar({
  trackColor = '#1e3b52',
  fillColor = '#25a8f1',
  textColor = '#ffffff',
  width = 1280,
  height = 48,
  style,
  className,
}: ProgressBarProps) {
  const { data: donorDriveData, isLoading, error } = useDonorDrive();

  // Loading / error placeholders (plain CSS)
  if (isLoading) {
    return (
      <div
        className={className}
        style={{
          width,
          height,
          borderRadius: 9999,
          backgroundColor: '#2a2a2a',
          opacity: 0.5,
        }}
      />
    );
  }
  if (error) {
    return (
      <div
        className={className}
        style={{
          width,
          height,
          borderRadius: 9999,
          backgroundColor: '#7f1d1d',
        }}
      />
    );
  }

  const donations = donorDriveData?.sumDonations ?? 0;
  const goal = donorDriveData?.fundraisingGoal ?? 2000;
  const pctRaw = (donations / goal) * 100;
  const pct = Math.max(0, Math.min(100, Number.isFinite(pctRaw) ? pctRaw : 0));

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: 9999,
        backgroundColor: trackColor,
        boxShadow:
          'inset 0 0 0 2px rgba(0,0,0,0.25), 0 2px 0 rgba(255,255,255,0.05)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Fill */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: `${pct}%`,
          backgroundColor: fillColor,
          borderRadius: 9999,
          transition: 'width 400ms ease',
          willChange: 'width',
        }}
      />
      {/* Centered text */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: textColor,
          fontWeight: 800,
          fontSize: 24,
          textShadow: '0 1px 0 rgba(0,0,0,0.35)',
          letterSpacing: 0.25,
        }}
      >
        ${donations.toLocaleString()}
      </div>
    </div>
  );
}
