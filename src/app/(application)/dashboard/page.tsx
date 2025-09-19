'use client';

import { Goals } from '@/components/original/cards/goals';
import { NextGoal } from '@/components/original/cards/next-goal';
import { TopDonor } from '@/components/original/cards/top-donor';
import { TotalRaised } from '@/components/original/cards/total-raised';
import { QuickResources } from '@/components/original/cards/quick-resources';
import { LatestDonations } from '@/components/original/cards/latest-donations';
import { useQuery } from 'convex/react';
import { useQuery as useTanStackQuery } from '@tanstack/react-query';
import { api } from '@/convex/_generated/api';
import {
  fetchStaticData,
  fetchRealTimeData,
  useDonorDriveDebug,
  useLastApiCallInfo,
  useUpdateLastApiCall,
  type StaticData,
  type RealTimeData,
} from '@/utils/donor-drive-optimized';
import type { Goal, Randomizer, Segment } from '@/types/db';

import { Schedule } from '@/components/original/cards/segments';
import { RandomizerCard } from '@/components/original/cards/randomizers';
import { EnvCheck } from '@/components/original/env-check';
import { DonationActivity } from '@/app/(application)/dashboard/_components/donation-activity';
import { Overview } from '@/app/(application)/dashboard/_components/overview';
import { GoalsSection } from '@/app/(application)/dashboard/_components/goals-section';
import { RandomizersSection } from '@/app/(application)/dashboard/_components/randomizers-section';
import { ScheduleSection } from '@/app/(application)/dashboard/_components/schedule-section';
import { QuickResourcesSection } from '@/app/(application)/dashboard/_components/quick-resources-section';

export default function AdminPage() {
  const convexRandomizers = useQuery(api.randomizer.list);
  const convexSegments = useQuery(api.segment.list);
  const convexGoals = useQuery(api.goals.list);
  const debugMutation = useDonorDriveDebug();
  const lastApiCallInfo = useLastApiCallInfo();
  const updateLastApiCall = useUpdateLastApiCall();

  const donorDriveId = process.env.NEXT_PUBLIC_DONORDRIVE_ID;

  // Static data - 24 hour cache, manual refresh only
  const { data: staticData } = useTanStackQuery({
    queryKey: ['staticData', donorDriveId],
    queryFn: () =>
      fetchStaticData(donorDriveId!, debugMutation, updateLastApiCall),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchInterval: false, // No automatic refetch
    enabled: !!donorDriveId,
  });

  // Real-time data - 15 second intervals with timestamp guard
  const { data: realTimeData } = useTanStackQuery({
    queryKey: ['realTimeData', donorDriveId, lastApiCallInfo?.timestamp],
    queryFn: () =>
      fetchRealTimeData(
        donorDriveId!,
        debugMutation,
        updateLastApiCall,
        lastApiCallInfo || undefined
      ),
    refetchInterval: 15000, // 15 seconds
    enabled: !!donorDriveId,
  });

  // Handle loading states
  if (
    convexRandomizers === undefined ||
    convexSegments === undefined ||
    convexGoals === undefined ||
    (!staticData && !realTimeData)
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

  // Combine static and real-time data, with fallbacks
  const validStaticData =
    staticData && staticData !== 'Rate limited' ? staticData : null;

  const combinedData = {
    // Static data with fallbacks
    avatarImageURL: validStaticData?.avatarImageURL || '',
    createdDateUTC: validStaticData?.createdDateUTC || '',
    displayName: validStaticData?.displayName || 'Loading...',
    eventID: validStaticData?.eventID || 0,
    eventName: validStaticData?.eventName || 'Demo Event',
    fundraisingGoal: validStaticData?.fundraisingGoal || 2000,
    hasActivityTracking: validStaticData?.hasActivityTracking || false,
    isCustomAvatarImage: validStaticData?.isCustomAvatarImage || false,
    isTeamCaptain: validStaticData?.isTeamCaptain || false,
    isTeamCoCaptain: validStaticData?.isTeamCoCaptain || false,
    links: validStaticData?.links || { donate: '', page: '', stream: '' },
    numIncentives: validStaticData?.numIncentives || 0,
    numMilestones: validStaticData?.numMilestones || 0,
    participantID: validStaticData?.participantID || 0,
    participantTypeCode: validStaticData?.participantTypeCode || '',
    role: validStaticData?.role || '',
    streamIsEnabled: validStaticData?.streamIsEnabled || false,
    streamingChannel: validStaticData?.streamingChannel || '',
    streamingPlatform: validStaticData?.streamingPlatform || '',
    teamID: validStaticData?.teamID || 0,
    teamName: validStaticData?.teamName || '',

    // Real-time data with fallbacks
    sumDonations:
      realTimeData &&
      realTimeData !== 'Rate limited' &&
      realTimeData !== 'Using cached data'
        ? realTimeData.sumDonations
        : 0,
    sumPledges:
      realTimeData &&
      realTimeData !== 'Rate limited' &&
      realTimeData !== 'Using cached data'
        ? realTimeData.sumPledges
        : 0,
    numDonations:
      realTimeData &&
      realTimeData !== 'Rate limited' &&
      realTimeData !== 'Using cached data'
        ? realTimeData.numDonations
        : 0,
    streamIsLive:
      realTimeData &&
      realTimeData !== 'Rate limited' &&
      realTimeData !== 'Using cached data'
        ? realTimeData.streamIsLive
        : false,
  };

  const donationsData =
    realTimeData &&
    realTimeData !== 'Rate limited' &&
    realTimeData !== 'Using cached data'
      ? realTimeData.latestDonations
      : [
          {
            displayName: 'Anonymous',
            amount: 50,
            message: 'Great cause!',
          },
          {
            displayName: 'Gaming Hero',
            amount: 100,
            message: 'Keep it up!',
          },
        ];

  const topDonorData =
    realTimeData &&
    realTimeData !== 'Rate limited' &&
    realTimeData !== 'Using cached data'
      ? realTimeData.topDonor || {
          displayName: 'No donations yet',
          donorID: 'none',
          avatarImageURL: '',
          modifiedDateUTC: '',
          sumDonations: 0,
          numDonations: 0,
        }
      : {
          displayName: 'Gaming Hero',
          donorID: 'demo',
          avatarImageURL: '',
          modifiedDateUTC: '',
          sumDonations: 100,
          numDonations: 1,
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
