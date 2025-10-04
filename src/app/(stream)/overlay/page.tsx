'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useConvexQuery } from '@convex-dev/react-query';
import { api } from '@/convex/_generated/api';
import { useDonorDrive } from '@/hooks/useDonorDrive';

import TimeLeft from './_components/time-left';
import TopRotator from './_components/top-rotator';
import { Randomizer } from './_components/randomizer';
import ProgressBar from './_components/progress-bar';
import { WheelSpins } from './_components/wheel-spins';

const OverlayContent = () => {
  const searchParams = useSearchParams();
  const limited = searchParams.get('limited') === 'true';

  // Rotator State
  const [panel, setPanel] = useState('timeLeft');
  const [confetti, setConfetti] = useState(false);

  // Get DonorDrive data
  const { data: donorDriveData, isLoading, error } = useDonorDrive();

  // Create combined data from Convex data (now flat structure)
  const combinedData = donorDriveData
    ? {
        displayName: donorDriveData.displayName || 'Loading...',
        fundraisingGoal: donorDriveData.fundraisingGoal || 2000,
        eventName: donorDriveData.eventName || 'Demo Event',
        links: { donate: '', page: '', stream: '' },
        streamIsEnabled: donorDriveData.streamIsEnabled || false,
        streamingChannel: donorDriveData.streamingChannel || '',
        streamingPlatform: donorDriveData.streamingPlatform || '',
        avatarImageURL: donorDriveData.avatarImageURL || '',
        participantID: 0,
        teamName: '',
        isTeamCaptain: false,
        isTeamCoCaptain: false,
        role: '',
        hasActivityTracking: false,
        numIncentives: 0,
        numMilestones: 0,
        sumDonations: donorDriveData.sumDonations || 0,
        sumPledges: donorDriveData.sumPledges || 0,
        numDonations: donorDriveData.numDonations || 0,
        streamIsLive: donorDriveData.streamIsLive || false,
        latestDonations: donorDriveData.latestDonations || [],
        topDonor: donorDriveData.topDonor || null,
      }
    : {
        displayName: 'Loading...',
        fundraisingGoal: 2000,
        eventName: 'Demo Event',
        links: { donate: '', page: '', stream: '' },
        streamIsEnabled: false,
        streamingChannel: '',
        streamingPlatform: '',
        avatarImageURL: '',
        participantID: 0,
        teamName: '',
        isTeamCaptain: false,
        isTeamCoCaptain: false,
        role: '',
        hasActivityTracking: false,
        numIncentives: 0,
        numMilestones: 0,
        sumDonations: 0,
        sumPledges: 0,
        numDonations: 0,
        streamIsLive: false,
        latestDonations: [],
        topDonor: null,
      };

  // Get goals from Convex (with fallback for auth issues)
  const convexGoals = useConvexQuery(api.goals.list, {});

  // Transform Convex data to match expected component types, with fallback
  const goals = (convexGoals || []).map((g) => ({
    id: g._id,
    title: g.title,
    amount: g.amount,
    endOfStream: g.endOfStream,
  }));

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

  // Trigger confetti when we're over 100% of the goal
  useEffect(() => {
    const progressPercentage = (combinedData.sumDonations / combinedData.fundraisingGoal) * 100;

    if (progressPercentage >= 100 && !confetti) {
      setConfetti(true);
      const timeout = setTimeout(() => {
        setConfetti(false);
      }, 30000);

      return () => clearTimeout(timeout);
    }
  }, [combinedData.sumDonations, combinedData.fundraisingGoal, confetti]);

  // Handle loading state (only for DonorDrive data, not Convex)
  if (isLoading) {
    return (
      <div className='relative w-[1920px] h-[1080px] flex items-center justify-center bg-black'>
        <div className='text-white text-2xl'>Loading overlay data...</div>
      </div>
    );
  }

  // Handle error state (only for DonorDrive data, not Convex)
  if (error) {
    return (
      <div className='relative w-[1920px] h-[1080px] flex items-center justify-center bg-black'>
        <div className='text-red-500 text-2xl'>Error loading overlay data</div>
      </div>
    );
  }

  return (
    <div className='relative w-[1920px] h-[1080px]'>
      {/* Confetti */}
      {!limited && confetti && (
        <div className='absolute inset-0 z-50 pointer-events-none'>
          {/* Simple confetti effect - you can replace this with a proper confetti library later */}
          <div className='w-full h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-75 animate-pulse' />
        </div>
      )}
      {/* Top Rotator */}
      {!limited && (
        <div className='absolute top-12 left-0 right-0 w-full flex justify-center'>
          <TopRotator
            goals={goals}
            data={combinedData}
          />
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
            <TimeLeft
              visible={panel === 'timeLeft'}
              timesUp={() => {}}
            />
            <WheelSpins visible={panel === 'wheelSpins'} />
          </div>
        </div>
      )}
      {/* Randomizer View */}
      {!limited && <Randomizer setConfetti={setConfetti} />}
    </div>
  );
};

const Overlay = () => {
  return (
    <Suspense
      fallback={
        <div className='relative w-[1920px] h-[1080px] flex items-center justify-center bg-black'>
          <div className='text-white text-2xl'>Loading overlay...</div>
        </div>
      }
    >
      <OverlayContent />
    </Suspense>
  );
};

export default Overlay;
