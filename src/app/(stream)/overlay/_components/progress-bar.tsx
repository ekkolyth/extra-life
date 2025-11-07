'use client';

import { CSSProperties } from 'react';
import { useDonorDrive } from '@/hooks/useDonorDrive';

type ProgressBarProps = {
  trackColor?: string;
  fillColor?: string;
  textColor?: string;
  width?: number;      // outer width
  height?: number;     // outer height (track thickness)
  borderWidth?: number;
  borderColor?: string;
  style?: CSSProperties;
  className?: string;
};

export default function ProgressBar({
  trackColor = '#1e3b52',
  fillColor = '#25a8f1',
  textColor = '#ffffff',
  width = 960,          // ← match original
  height = 64,          // ← tailwind h-16
  borderWidth = 4,      // ← tailwind border-4
  borderColor = 'rgba(0,0,0,0.35)',
  style,
  className,
}: ProgressBarProps) {
  const { data: donorDriveData, isLoading, error } = useDonorDrive();

  if (isLoading) {
    return (
      <div
        className={className}
        style={{
          width, height, borderRadius: 9999,
          backgroundColor: '#2a2a2a', opacity: 0.5,
        }}
      />
    );
  }
  if (error) {
    return (
      <div
        className={className}
        style={{
          width, height, borderRadius: 9999,
          backgroundColor: '#7f1d1d',
        }}
      />
    );
  }

  const donations = donorDriveData?.sumDonations ?? 0;
  const goal = donorDriveData?.fundraisingGoal ?? 2000;
  const pct = Math.max(0, Math.min(100, (donations / goal) * 100 || 0));

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: 9999,
        backgroundColor: trackColor,
        border: `${borderWidth}px solid ${borderColor}`,
        boxShadow: '0 6px 16px rgba(0,0,0,0.25)', // similar to "shadow-super"
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Fill */}
      <div
        style={{
          position: 'absolute',
          left: 0, top: 0, bottom: 0,
          width: `${pct}%`,
          backgroundColor: fillColor,
          borderRadius: 9999,
          transition: 'width 400ms ease',
          willChange: 'width',
        }}
      />
      {/* Centered amount */}
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
