'use client';

import { useState, useEffect } from 'react';
import { useConvexQuery } from '@convex-dev/react-query';
import { api } from '@/convex/_generated/api';

interface RandomizerProps {
  setConfetti: (confetti: boolean) => void;
}

export function Randomizer(props: RandomizerProps) {
  const { setConfetti } = props;

  // Randomizer State
  const [visible, setVisible] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [choiceIndex, setChoiceIndex] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);

  // Get randomizers from Convex
  const randomizers = useConvexQuery(api.randomizer.list, {});

  // For now, we'll use a simple demo mode since we removed Ably
  // You can implement Convex real-time subscriptions here later
  useEffect(() => {
    // Demo: Show randomizer every 30 seconds
    const interval = setInterval(() => {
      if (randomizers && randomizers.length > 0) {
        const randomRandomizer = randomizers[Math.floor(Math.random() * randomizers.length)];
        if (randomRandomizer.items && randomRandomizer.items.length > 0) {
          setChoices(randomRandomizer.items.map((item) => item.name));
          setVisible(true);
          setSpinning(true);

          // After 3 seconds, stop spinning and show result
          setTimeout(() => {
            setSpinning(false);
            setChoiceIndex(Math.floor(Math.random() * randomRandomizer.items.length));
            setConfetti(true);
          }, 3000);

          // After 8 seconds, hide confetti
          setTimeout(() => {
            setConfetti(false);
          }, 8000);

          // After 9 seconds, hide randomizer
          setTimeout(() => {
            setVisible(false);
          }, 9000);
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [randomizers, setConfetti]);

  if (!visible) return null;

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='bg-gray-900 rounded-lg shadow overflow-hidden p-12 w-full max-w-4xl'>
        {spinning ? (
          <p className='text-4xl font-bold animate-pulse'>
            {choices[choiceIndex % choices.length]}
          </p>
        ) : (
          <p className='text-4xl font-bold'>
            {choices[choiceIndex % choices.length] ?? 'Loading...'}
          </p>
        )}
      </div>
    </div>
  );
}
