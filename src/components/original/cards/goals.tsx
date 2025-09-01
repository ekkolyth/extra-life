'use client';

import type { Goal } from '@/types/db';

import { ChartBarIcon, CheckCircleIcon, ClockIcon } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { StatsResult, fetchStats } from '@/utils/donor-drive';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQuery } from 'convex/react';
import { USDollar } from '@/utils/currency';

interface GoalsProps {
  data: StatsResult;
  goals: Goal[];
}

export const Goals = (props: GoalsProps) => {
  const { data: stats, goals } = props;

  const id = String(process.env.NEXT_PUBLIC_DONORDRIVE_ID);
  const { data } = useQuery('stats', () => fetchStats(id), {
    initialData: stats,
    enabled: !!id,
    refetchInterval: 15000,
  });
  const { data: liveGoals, error: goalsError } = useQuery(
    'goals',
    async () => {
      const res = await fetch('/api/goals');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json() as Goal[];
    },
    {
      initialData: goals,
      enabled: !!id,
      refetchInterval: 15000,
      retry: 1,
    }
  );

  const nextGoalIndex =
    data && typeof data !== 'string' && data.sumDonations
      ? goals.findIndex((goal) => goal.amount > data.sumDonations)
      : 0;

  // Show error state if goals failed to load
  if (goalsError) {
    return (
      <Card title='Goals' icon={<ChartBarIcon />}>
        <div className='mt-4 text-center text-muted-foreground'>
          <p>Failed to load goals</p>
          <p className='text-sm'>Please check your authentication</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title='Goals' icon={<ChartBarIcon />}>
      <div className='mt-4 -mx-6'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <span className='sr-only'>Status</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {typeof liveGoals !== 'string' &&
              liveGoals?.map((goal, index) => (
                <TableRow key={goal.id}>
                  <TableCell>
                    {nextGoalIndex > index ? (
                      <CheckCircleIcon className='w-4 h-4 text-green-600' />
                    ) : (
                      <ClockIcon className='w-4 h-4 text-gray-400' />
                    )}
                  </TableCell>
                  <TableCell>
                    <p className='text-sm'>{goal.title}</p>
                    <p className='text-primary text-xs font-semibold'>
                      {goal.endOfStream ? 'End Of Stream' : null}
                    </p>
                  </TableCell>
                  <TableCell>{USDollar.format(goal.amount)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
