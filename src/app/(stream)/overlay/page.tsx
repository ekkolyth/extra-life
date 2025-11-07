'use client';

import styles from './overlay.module.css';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useConvexQuery } from '@convex-dev/react-query';
import { api } from '@/convex/_generated/api';
import { useDonorDrive } from '@/hooks/useDonorDrive';

import TimeLeft from './_components/time-left';
import TopRotator from './_components/top-rotator';
import { Randomizer } from './_components/randomizer';
import ProgressBar from './_components/progress-bar';
import { WheelSpins } from './_components/wheel-spins';
import { DonationVideoOverlay } from './_components/donation-video-overlay';
import { useDonationVideoTrigger } from '@/hooks/useDonationVideoTrigger';

const OverlayContent = () => {
  const searchParams = useSearchParams();
  const limited = searchParams.get('limited') === 'true';

  const [panel, setPanel] = useState<'timeLeft' | 'wheelSpins'>('timeLeft');
  const [confetti, setConfetti] = useState(false);

  const { data: donorDriveData, isLoading, error } = useDonorDrive();

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

  // Goals from Convex
  const convexGoals = useConvexQuery(api.goals.list, {});

  type Goal = NonNullable<typeof convexGoals>[number];

  const goals = (convexGoals ?? []).map((g: Goal) => ({
    id: g._id,
    title: g.title,
    amount: g.amount,
    endOfStream: g.endOfStream,
  }));


  const { shouldPlayVideo, currentDonation, handleVideoEnd } = useDonationVideoTrigger({
    latestDonations: combinedData.latestDonations,
    threshold: 100,
    timeWindowSeconds: 15,
  });

  const [showTestVideo, setShowTestVideo] = useState(false);
  useEffect(() => {
    const checkForTestTrigger = async () => {
      try {
        const response = await fetch('/api/test-video');
        const data = await response.json();
        if (data.triggered) setShowTestVideo(true);
      } catch { }
    };
    const interval = setInterval(checkForTestTrigger, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPanel(prev => (prev === 'timeLeft' ? 'wheelSpins' : 'timeLeft'));
    }, panel === 'wheelSpins' ? 5000 : 10000);
    return () => clearTimeout(timer);
  }, [panel]);

  const handleTimesUp = useCallback(() => { }, []);

  useEffect(() => {
    const pct = (combinedData.sumDonations / combinedData.fundraisingGoal) * 100;
    if (pct >= 100 && !confetti) {
      setConfetti(true);
      const t = setTimeout(() => setConfetti(false), 30000);
      return () => clearTimeout(t);
    }
  }, [combinedData.sumDonations, combinedData.fundraisingGoal, confetti]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingText}>Loading overlay data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingText} style={{ color: '#ef4444' }}>
          Error loading overlay data
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlayRoot}>
      <DonationVideoOverlay
        isVisible={shouldPlayVideo}
        donation={currentDonation}
        onVideoEnd={handleVideoEnd}
      />

      <DonationVideoOverlay
        isVisible={showTestVideo}
        donation={{
          amount: 250.0,
          displayName: 'Anonymous',
          message: 'For the kids!',
          createdDateUTC: new Date().toISOString(),
        }}
        onVideoEnd={() => setShowTestVideo(false)}
      />

      {!limited && confetti && <div className={styles.confettiLayer} />}

      {!limited && (
        <div className={styles.topRotatorWrap}>
          <TopRotator goals={goals} data={combinedData} />
        </div>
      )}

      {!limited && (
        <div className={styles.progressbarWrap}>
          <ProgressBar />
        </div>
      )}

      {!limited && (
        <div className={styles.bottomRightPanel}>
          <div className={styles.panelCard}>
            <TimeLeft visible={panel === 'timeLeft'} timesUp={handleTimesUp} />
            <WheelSpins visible={panel === 'wheelSpins'} />
          </div>
        </div>
      )}

      {!limited && <Randomizer setConfetti={setConfetti} />}
    </div>
  );
};

const Overlay = () => {
  return (
    <Suspense
      fallback={
        <div className={styles.loading}>
          <div className={styles.loadingText}>Loading overlay...</div>
        </div>
      }
    >
      <OverlayContent />
    </Suspense>
  );
};

export default Overlay;
