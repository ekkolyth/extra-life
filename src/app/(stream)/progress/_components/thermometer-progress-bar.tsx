'use client';

import { CSSProperties } from 'react';
import { useDonorDrive } from '@/hooks/useDonorDrive';

type ThermometerProgressBarProps = {
  fillColor?: string;
  style?: CSSProperties;
  className?: string;
};

export default function ThermometerProgressBar({
  fillColor = '#ef4444', // Red color for thermometer fill
  style,
  className,
}: ThermometerProgressBarProps) {
  const { data: donorDriveData, isLoading, error } = useDonorDrive();

  if (isLoading || error) {
    return null; // Don't show anything while loading or on error
  }

  const tempTestValue = process.env.NEXT_PUBLIC_TEMP_TEST;
  const overrideDonations = tempTestValue ? parseFloat(tempTestValue) : null;

  // Debug logging
  console.log('[ThermometerProgressBar] NEXT_PUBLIC_TEMP_TEST:', tempTestValue);
  console.log('[ThermometerProgressBar] overrideDonations:', overrideDonations);
  console.log('[ThermometerProgressBar] real donations:', donorDriveData?.sumDonations);

  // Use override value if available, otherwise use real donations
  const donations =
    overrideDonations !== null && !isNaN(overrideDonations)
      ? overrideDonations
      : donorDriveData?.sumDonations ?? 0;

  console.log('[ThermometerProgressBar] final donations value:', donations);

  // Thermometer maxes out at $2500
  const maxGoal = 2500;
  const pct = Math.max(0, Math.min(100, (donations / maxGoal) * 100 || 0));

  console.log('[ThermometerProgressBar] donations:', donations, 'percentage:', pct);

  // Gradient: yellow at bottom, orange in middle, red at top
  // The gradient spans the full container height (600px), so as the bar fills, you see more colors
  // At low values: only yellow visible
  // At medium values: yellow transitioning to orange
  // At full: complete yellow -> orange -> red gradient
  const gradient = 'linear-gradient(to top, #FFEB3B 0%, #FF9800 50%, #EF4444 100%)';

  // The full height of the thermometer container, matching .thermometerContainer in CSS
  const containerHeight = 600;
  // Calculate the fill height in pixels (percentage of container height)
  const fillHeightPx = (containerHeight * pct) / 100;
  // Position the gradient so its bottom (yellow) aligns with the fill div's bottom
  // The gradient is 600px tall. We want to show the bottom portion of the gradient.
  // backgroundPosition Y value: 0 = top of gradient at top of element, 100% = bottom of gradient at bottom of element
  // We want bottom of gradient at bottom of fill div, so we position it at: fillHeight - containerHeight
  // This ensures only the bottom portion of the gradient is visible when fill is low
  const backgroundPositionY = fillHeightPx > 0 ? `${fillHeightPx - containerHeight}px` : '0px';

  // Simple rectangle that fills from bottom to top
  // The image will mask it to show only through the transparent thermometer section
  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: `${pct}%`,
        background: gradient,
        backgroundSize: `100% ${containerHeight}px`, // Gradient spans the full container height
        backgroundPosition: `center ${backgroundPositionY}`, // Center horizontally, position vertically
        backgroundRepeat: 'no-repeat',
        transition: 'height 400ms ease, background-position 400ms ease',
        willChange: 'height, background-position',
        ...style,
      }}
    />
  );
}
