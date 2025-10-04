'use client';

import { useState, useEffect } from 'react';

export const WheelSpins = ({ visible }: { visible: boolean }) => {

  // For now, we'll use demo data since we removed the donor-drive integration
  // You can implement TanStack Query here later for real-time wheel spin data from external APIs
  const [left, setLeft] = useState(5);
  const total = 12;

  // Demo mode - simulate some activity
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setLeft((prev) => Math.max(0, prev - 1));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={visible ? '' : 'hidden'}>
      <p className='font-bold text-3xl text-white mb-2'>wheel spins</p>
      <p className='font-bold text-4xl text-white'>
        {left} / {total}
      </p>
    </div>
  );
};
