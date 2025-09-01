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
import { fetchStats, fetchLatestDonations, fetchTopDonor } from '@/utils/donor-drive';

import { Schedule } from '@/components/original/cards/segments';
import { RandomizerCard } from '@/components/original/cards/randomizers';
import { EnvCheck } from '@/components/original/env-check';
import { DonationActivity } from '@/components/dashboard/donation-activity';
import { Overview } from '@/components/dashboard/overview';

export default function AdminPage() {
  // Use Convex queries for real-time database data
  const convexRandomizers = useQuery(api.randomizer.list);
  const convexSegments = useQuery(api.segment.list);
  const convexGoals = useQuery(api.goals.list);

  // Use TanStack Query for donor-drive API calls with proper rate limiting
  const donorDriveId = process.env.NEXT_PUBLIC_DONORDRIVE_ID;

  const { data: stats } = useTanStackQuery({
    queryKey: ['donationStats'],
    queryFn: () => fetchStats(donorDriveId!),
    refetchInterval: 15000, // 15 seconds as requested
    enabled: !!donorDriveId, // Only run if we have the ID
  });

  const { data: donations } = useTanStackQuery({
    queryKey: ['latestDonations'],
    queryFn: () => fetchLatestDonations(donorDriveId!, 10),
    refetchInterval: 15000, // 15 seconds as requested
    enabled: !!donorDriveId, // Only run if we have the ID
  });

  const { data: topDonor } = useTanStackQuery({
    queryKey: ['topDonor'],
    queryFn: () => fetchTopDonor(donorDriveId!),
    refetchInterval: 15000, // 15 seconds as requested
    enabled: !!donorDriveId, // Only run if we have the ID
  });

  // Handle loading states
  if (
    convexRandomizers === undefined ||
    convexSegments === undefined ||
    convexGoals === undefined
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
  const randomizers = (convexRandomizers || []).map((r) => ({
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

  const segments = (convexSegments || []).map((s) => ({
    id: s._id,
    title: s.title,
    startsAt: s.startsAt,
    duration: s.duration,
  }));

  const goals = (convexGoals || []).map((g) => ({
    id: g._id,
    title: g.title,
    amount: g.amount,
    endOfStream: g.endOfStream,
  }));

  // Use real data if available, fallback to demo data
  const statsData =
    stats && stats !== 'Rate limited'
      ? stats
      : {
          avatarImageURL: '',
          createdDateUTC: '',
          displayName: 'Demo User',
          eventID: 0,
          eventName: 'Demo Event',
          fundraisingGoal: 0,
          hasActivityTracking: false,
          isCustomAvatarImage: false,
          isTeamCaptain: false,
          isTeamCoCaptain: false,
          links: { donate: '', page: '', stream: '' },
          numDonations: 0,
          numIncentives: 0,
          numMilestones: 0,
          participantID: 0,
          participantTypeCode: '',
          role: '',
          streamIsEnabled: false,
          streamIsLive: false,
          streamingChannel: '',
          streamingPlatform: '',
          sumDonations: 0,
          sumPledges: 0,
          teamID: 0,
          teamName: '',
        };

  const donationsData =
    donations && donations !== 'Rate limited'
      ? donations
      : [
          { displayName: 'Anonymous', amount: 50, message: 'Great cause!' },
          { displayName: 'Gaming Hero', amount: 100, message: 'Keep it up!' },
        ];

  const topDonorData =
    topDonor && topDonor !== 'Rate limited'
      ? topDonor
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
      <div className='grid grid-cols-3 gap-4'>
        <div className='flex flex-col gap-y-4'>
          <TotalRaised data={statsData} />
          <QuickResources />
        </div>
        <div className='flex flex-col gap-y-4'>
          <Schedule segments={segments} />
          <RandomizerCard randomizers={randomizers} />
          <LatestDonations data={donationsData} />
        </div>
        <div className='flex flex-col gap-y-4'>
          <TopDonor data={topDonorData} />
          <NextGoal data={statsData} goals={goals} />
          <Goals data={statsData} goals={goals} />
        </div>
      </div>
      <Overview />
      <DonationActivity />
    </div>
  );
}
