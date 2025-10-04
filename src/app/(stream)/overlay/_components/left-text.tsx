'use client';

import { useEffect, useState } from 'react';
import { useConvexQuery } from '@convex-dev/react-query';
import { api } from '@/convex/_generated/api';

interface LeftTextProps {
  data: {
    displayName: string;
    fundraisingGoal: number;
    eventName: string;
    links: { donate: string; page: string; stream: string };
    streamIsEnabled: boolean;
    streamingChannel: string;
    streamingPlatform: string;
    avatarImageURL: string;
    participantID: number;
    teamName: string;
    isTeamCaptain: boolean;
    isTeamCoCaptain: boolean;
    role: string;
    hasActivityTracking: boolean;
    numIncentives: number;
    numMilestones: number;
    sumDonations: number;
    sumPledges: number;
    numDonations: number;
    streamIsLive: boolean;
    latestDonations: Array<{
      amount: number;
      avatarImageURL?: string;
      createdDateUTC?: string;
      donationID?: string;
      displayName?: string;
      donorID?: string;
      eventID?: number;
      isRegFee?: boolean;
      message?: string;
      modifiedDateUTC?: string;
      participantID?: number;
      recipientImageURL?: string;
      recipientName?: string;
      teamID?: number;
    }>;
    topDonor: {
      displayName?: string;
      donorID?: string;
      avatarImageURL: string;
      modifiedDateUTC: string;
      sumDonations: number;
      numDonations: number;
      recipientImageURL?: string;
    } | null;
  };
}

export function LeftText({}: LeftTextProps) {
  const [rotating, setRotating] = useState(false);
  const [index, setIndex] = useState(0);

  // Use Convex to fetch rotators from the database
  const rotators = useConvexQuery(api.rotator.list, {}) || [];

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
