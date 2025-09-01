import { Goals } from '@/components/original/cards/goals';
import { NextGoal } from '@/components/original/cards/next-goal';
import { TopDonor } from '@/components/original/cards/top-donor';
import { TotalRaised } from '@/components/original/cards/total-raised';
import { QuickResources } from '@/components/original/cards/quick-resources';
import { LatestDonations } from '@/components/original/cards/latest-donations';
import { fetchLatestDonations, fetchStats, fetchTopDonor } from '@/utils/donor-drive';

import { Schedule } from '@/components/original/cards/segments';
import { RandomizerCard } from '@/components/original/cards/randomizers';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import WheelSpins from '@/components/original/cards/wheel-spins';
import { EnvCheck } from '@/components/original/env-check';

export default async function AdminPage() {
  const id = process.env.NEXT_PUBLIC_DONORDRIVE_ID;
  if (id === undefined) {
    return (
      <div className='space-y-4'>
        <EnvCheck />
        <Card>
          <CardHeader>
            <CardTitle className='text-center'>Configuration Required</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  try {
    const randomizersData = getRandomizers();
    const segmentsData = getSegments();
    const goalsData = getGoals();
    const statsData = fetchStats(id);
    const donationsData = fetchLatestDonations(id, 10);
    const topDonorData = fetchTopDonor(id);

    const [randomizers, segments, goals, stats, donations, topDonor] = await Promise.all([
      randomizersData,
      segmentsData,
      goalsData,
      statsData,
      donationsData,
      topDonorData,
    ]);

    return (
      <div className='space-y-4'>
        <EnvCheck />
        <div className='grid grid-cols-3 gap-4'>
          <div className='flex flex-col gap-y-4'>
            {typeof stats !== 'string' ? <TotalRaised data={stats} /> : <RateLimitedCard />}
            <QuickResources />
          </div>
          <div className='flex flex-col gap-y-4'>
            <Schedule segments={segments} />
            {typeof donations !== 'string' ? (
              <RandomizerCard randomizers={randomizers} />
            ) : (
              <RateLimitedCard />
            )}
            {typeof donations !== 'string' ? (
              <LatestDonations data={donations} />
            ) : (
              <RateLimitedCard />
            )}
          </div>
          <div className='flex flex-col gap-y-4'>
            {typeof topDonor !== 'string' ? <TopDonor data={topDonor} /> : <RateLimitedCard />}
            {typeof goals !== 'string' && typeof stats !== 'string' ? (
              <>
                <NextGoal data={stats} goals={goals} />
                <Goals data={stats} goals={goals} />
              </>
            ) : (
              <>
                <RateLimitedCard />
                <RateLimitedCard />
              </>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Admin page error:', error);
    return (
      <div className='space-y-4'>
        <EnvCheck />
        <Card>
          <CardHeader>
            <CardTitle className='text-center text-destructive'>Error Loading Dashboard</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }
}

function RateLimitedCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-center'>Rate Limited</CardTitle>
      </CardHeader>
    </Card>
  );
}
