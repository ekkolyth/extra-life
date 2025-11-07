'use client';

import type { Goal } from '@/types/db';
import { useEffect, useState, useMemo } from 'react';
import { useConvexQuery } from '@convex-dev/react-query';
import { api } from '@/convex/_generated/api';
import { useSegments } from '@/utils/useSegments';

const eventDateEnd = new Date('November 8, 2025 22:00:00');

interface TopRotatorProps {
  goals: Goal[];
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

export function RightText(props: TopRotatorProps) {
  const { goals, data } = props;
  const [index, setIndex] = useState(0);
  const [nextGoal, setNextGoal] = useState<Goal | null>(null);
  const [timeLeft, setTimeLeft] = useState('00h 00m 00s');

  // Use the data passed from parent
  const combinedData = data;

  // Use Convex for database queries
  const convexSegments = useConvexQuery(api.segment.list, {}) || [];
  const segments = convexSegments.map((s: NonNullable<typeof convexSegments>[number]) => ({
    id: s._id,
    title: s.title,
    startsAt: s.startsAt,
    duration: s.duration,
  }));
  const { currentSegment, nextSegment } = useSegments(segments);

  useEffect(() => {
    if (combinedData && goals && goals.length) {
      setNextGoal(goals.find((goal) => goal.amount > combinedData.sumDonations) ?? null);
    }
  }, [combinedData, goals]);

  // Calculate time left
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const timeDifference = eventDateEnd.getTime() - now.getTime();

      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      setTimeLeft(
        `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(
          seconds
        ).padStart(2, '0')}s`
      );
    };

    updateCountdown(); // Initial call
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Memoize bonusText to prevent recreation on every render
  const bonusText = useMemo(
    () => [
      {
        label: 'right now',
        text: currentSegment?.title ?? '',
      },
      {
        label: 'up next',
        text: nextSegment?.title ?? '',
      },
      {
        label: 'top donation',
        text:
          combinedData.latestDonations.length > 0
            ? `${combinedData.latestDonations[0]?.displayName ?? 'Anonymous'} - $${
                combinedData.latestDonations[0]?.amount ?? 0
              }`
            : '',
      },
      {
        label: 'top donator',
        text: combinedData.topDonor ? `${combinedData.topDonor.displayName}` : '',
      },
      {
        label: 'next goal unlock',
        text: nextGoal
          ? `${nextGoal?.title}${nextGoal?.endOfStream ? ` - End Of Stream` : ''}`
          : '',
      },
      {
        label: 'time left',
        text: timeLeft,
      },
    ],
    [
      currentSegment,
      nextSegment,
      combinedData.latestDonations,
      combinedData.topDonor,
      nextGoal,
      timeLeft,
    ]
  );

  const visibleIndex = index % bonusText.length;

  // Every 7 seconds increment the index
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => prevIndex + 1);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='flex-grow flex justify-end py-1'>
      <div className='text-right'>
        <p className='text-2xl font-bold text-white -mb-1'>{bonusText[visibleIndex].label}</p>
        <p className='text-2xl font-bold text-white truncate'>{bonusText[visibleIndex].text}</p>
      </div>
    </div>
  );
}
