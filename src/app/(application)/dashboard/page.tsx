'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useDonorDrive } from '@/hooks/useDonorDrive';
import type { Goal, Randomizer, Segment } from '@/types/db';

import { EnvCheck } from '@/components/env-check';
import { TopDonor } from '@/app/(application)/dashboard/_components/top-donor';
import { Overview } from '@/app/(application)/dashboard/_components/overview';
import { GoalsSection } from '@/app/(application)/dashboard/_components/goals';
import { RandomizersSection } from '@/app/(application)/dashboard/_components/randomizers';
import { ScheduleSection } from '@/app/(application)/dashboard/_components/schedule';
import { QuickResourcesSection } from '@/app/(application)/dashboard/_components/quick-resources';

export default function AdminPage() {
  const convexRandomizers = useQuery(api.randomizer.list);
  const convexSegments = useQuery(api.segment.list);
  const convexGoals = useQuery(api.goals.list);

  // Use the simple hook
  const {
    data: donorDriveData,
    isLoading: donorDriveLoading,
    error: donorDriveError,
  } = useDonorDrive();

  // Debug logging
  console.log('Dashboard Debug:', {
    donorDriveData,
    isLoading: donorDriveLoading,
    error: donorDriveError,
  });

  // Handle loading states
  if (
    convexRandomizers === undefined ||
    convexSegments === undefined ||
    convexGoals === undefined ||
    donorDriveLoading
  ) {
    return (
      <div className='space-y-4'>
        <EnvCheck />
        <div className='flex items-center justify-center p-8'>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Handle error states
  if (donorDriveError) {
    return (
      <div className='space-y-4'>
        <EnvCheck />
        <div className='flex items-center justify-center p-8'>
          <div className='text-center'>
            <p className='text-red-500 mb-4'>Error loading donor drive data</p>
          </div>
        </div>
      </div>
    );
  }

  // Transform Convex data to match expected component types
  const randomizers: Randomizer[] = (convexRandomizers || []).map((r) => ({
    id: r._id,
    name: r.name,
    items:
      r.items?.map((item) => ({
        id: item._id,
        name: item.name,
        limit: item.limit,
        redeemed: item.redeemed,
        randomizerId: item.randomizerId,
      })) || [],
    redemptions: [], // TODO: Implement redemptions query
  }));

  const segments: Segment[] = (convexSegments || []).map((s) => ({
    id: s._id,
    title: s.title,
    startsAt: s.startsAt,
    duration: s.duration,
  }));

  const goals: Goal[] = (convexGoals || []).map((g) => ({
    id: g._id,
    title: g.title,
    amount: g.amount,
    endOfStream: g.endOfStream,
  }));

  // Create combined data from Convex data (now flat structure)
  const combinedData = donorDriveData
    ? {
        displayName: donorDriveData.displayName || 'Loading...',
        fundraisingGoal: donorDriveData.fundraisingGoal || 2000,
        eventName: donorDriveData.eventName || 'Demo Event',
        streamIsEnabled: donorDriveData.streamIsEnabled || false,
        streamingChannel: donorDriveData.streamingChannel || '',
        streamingPlatform: donorDriveData.streamingPlatform || '',
        avatarImageURL: donorDriveData.avatarImageURL || '',
        participantID: donorDriveData.participantId ? parseInt(donorDriveData.participantId) : 0,
        sumDonations: donorDriveData.sumDonations || 0,
        sumPledges: donorDriveData.sumPledges || 0,
        numDonations: donorDriveData.numDonations || 0,
        streamIsLive: donorDriveData.streamIsLive || false,
        latestDonations: donorDriveData.latestDonations || [],
        topDonor: donorDriveData.topDonor || null,
        links: { donate: '', page: '', stream: '' },
        teamName: '',
        isTeamCaptain: false,
        isTeamCoCaptain: false,
        role: '',
        hasActivityTracking: false,
        numIncentives: 0,
        numMilestones: 0,
      }
    : {
        // Fallback data
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

  const topDonorData = combinedData.topDonor || {
    displayName: 'No donations yet',
    donorID: 'none',
    avatarImageURL: '',
    modifiedDateUTC: '',
    sumDonations: 0,
    numDonations: 0,
  };

  return (
    <div className='space-y-4'>
      <EnvCheck />
      <div className='space-y-6'>
        <Overview data={combinedData} />
        <QuickResourcesSection />

        <div className='grid md:grid-cols-2 gap-6'>
          <GoalsSection
            data={combinedData}
            goals={goals}
          />
          <div className='space-y-6'>
            <ScheduleSection segments={segments} />
            <RandomizersSection randomizers={randomizers} />
            <TopDonor data={topDonorData} />
          </div>
        </div>
      </div>
    </div>
  );
}
