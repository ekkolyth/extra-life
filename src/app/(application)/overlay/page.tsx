'use client';

import type { Goal } from '@/types/db';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

import TimeLeft from '@/components/overlay/time-left';
import TopRotator from '@/components/overlay/top-rotator';
import { Randomizer } from '@/components/overlay/randomizer';
import ProgressBar from '@/components/overlay/progress-bar';
import { WheelSpins } from '@/components/overlay/wheel-spins';

const Overlay = () => {
  const searchParams = useSearchParams();
  const limited = searchParams.get('limited') === 'true';

  // Rotator State
  const [panel, setPanel] = useState('timeLeft');
  const [confetti, setConfetti] = useState(false);
  const [timesUp, setTimesUp] = useState(false);

  // Get goals from Convex
  const goals = useQuery(api.goals.list) || [];

  // Display time left for 5 seconds, then switch to wheel spins for 10 seconds, then repeat
  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (panel === 'timeLeft') {
          setPanel('wheelSpins');
        } else {
          setPanel('timeLeft');
        }
      },
      panel === 'wheelSpins' ? 5000 : 10000
    );
    return () => clearTimeout(timer);
  }, [panel]);

  // Once times up turns to true, set confetti to true
  // After 1 minute, set confetti to false
  useEffect(() => {
    if (timesUp) {
      setConfetti(true);
      const timeout = setTimeout(() => {
        setConfetti(false);
      }, 30000);

      return () => clearTimeout(timeout);
    }
  }, [timesUp]);

  return (
    <div className='relative w-[1920px] h-[1080px]'>
      {/* Confetti */}
      {!limited && confetti && (
        <div className='absolute inset-0 z-50'>
          {/* Simple confetti effect - you can replace this with a proper confetti library later */}
          <div className='w-full h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-75 animate-pulse' />
        </div>
      )}
      {/* Top Rotator */}
      {!limited && (
        <div className='absolute top-12 left-0 right-0 w-full flex justify-center'>
          <TopRotator goals={goals} />
        </div>
      )}
      {/* Progress Bar */}
      {!limited && (
        <div className='absolute bottom-12 left-0 right-0 w-full flex justify-center'>
          <ProgressBar />
        </div>
      )}
      {/* Bottom Right Panel */}
      {!limited && (
        <div className='absolute bottom-14 right-12'>
          <div className='bg-primary w-72 rounded-xl py-4 px-6 shadow relative'>
            <TimeLeft visible={panel === 'timeLeft'} timesUp={(value) => setTimesUp(value)} />
            <WheelSpins visible={panel === 'wheelSpins'} />
          </div>
        </div>
      )}
      {/* Randomizer View */}
      {!limited && <Randomizer setConfetti={setConfetti} />}
    </div>
  );
};
export default Overlay;
