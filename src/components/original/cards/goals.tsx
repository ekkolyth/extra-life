'use client';

import type { Goal } from '@/types/db';

import { ChartBarIcon, CheckCircleIcon, ClockIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import ContentCard from './card';
import { StatsResult, fetchStats } from '@/utils/donor-drive';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { USDollar } from '@/utils/currency';

interface GoalsProps {
  data: StatsResult;
  goals: Goal[];
}

export const Goals = (props: GoalsProps) => {
  const { data: stats, goals } = props;
  const [liveGoals, setLiveGoals] = useState<Goal[]>(goals || []);
  const [goalsError, setGoalsError] = useState<Error | null>(null);

  if (!goals || goals.length === 0) {
    return (
      <ContentCard title='Goals' icon={<ChartBarIcon />}>
        <div className='mt-4 text-center text-muted-foreground'>
          <p>No goals found</p>
          <p className='text-sm'>Add some goals to get started</p>
        </div>
      </ContentCard>
    );
  }

  const id = String(process.env.NEXT_PUBLIC_DONORDRIVE_ID);

  useEffect(() => {
    if (id) {
      const fetchGoals = async () => {
        try {
          const res = await fetch('/api/goals');
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const data = await res.json();
          setLiveGoals(data);
          setGoalsError(null);
        } catch (error) {
          setGoalsError(error as Error);
        }
      };

      fetchGoals();
      const interval = setInterval(fetchGoals, 15000);
      return () => clearInterval(interval);
    }
  }, [id]);

  const nextGoalIndex =
    stats && typeof stats !== 'string' && stats.sumDonations
      ? goals.findIndex((goal) => goal.amount > stats.sumDonations)
      : 0;

  // Show error state if goals failed to load
  if (goalsError) {
    return (
      <ContentCard title='Goals' icon={<ChartBarIcon />}>
        <div className='mt-4 text-center text-muted-foreground'>
          <p>Failed to load goals</p>
          <p className='text-sm'>Please check your authentication</p>
        </div>
      </ContentCard>
    );
  }

  return (
    <ContentCard title='Goals' icon={<ChartBarIcon />}>
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
            {liveGoals?.map((goal: Goal, index: number) => (
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
    </ContentCard>
  );
};
