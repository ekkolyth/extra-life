'use client';

import type { Rotator } from '@/types/db';
import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function LeftText() {
  const [rotating, setRotating] = useState(false);
  const [index, setIndex] = useState(0);

  // Use Convex to fetch rotators from the database
  const rotators = useQuery(api.rotator.list) || [];

  const length = rotators.length;
  const visibleIndex = index % length;

  useEffect(() => {
    setRotating(true);
    const interval = setInterval(() => setIndex((index) => index + 1), 7000);
    return () => clearInterval(interval);
  }, []);

  // Fallback text if no rotators are available
  const fallbackText = 'Change Kids Health. Change the Future.';

  return (
    <div>
      {rotating ? (
        <p className='text-white font-bold text-2xl truncate animate-pulse'>
          {rotators[visibleIndex]?.text || fallbackText}
        </p>
      ) : (
        <p className='text-white font-bold text-2xl truncate'>{fallbackText}</p>
      )}
    </div>
  );
}
