'use client';

import type { Goal } from '@/types/db';

import { FlagIcon } from 'lucide-react';

import ContentCard from './card';
import { StatsResult, fetchStats } from '@/utils/donor-drive';

interface NextGoalProps {
  data: StatsResult;
  goals: Goal[];
}

export const NextGoal = (props: NextGoalProps) => {
  const { data: stats, goals } = props;

  if (typeof stats === 'string' || !stats || !goals || goals.length === 0) {
    return null;
  }

  const nextGoal = goals.find((goal) => goal.amount > stats.sumDonations);

  return (
    <ContentCard title='Next Goal' icon={<FlagIcon />}>
      <p className='text-3xl font-bold text-primary text-center'>{nextGoal?.title}</p>
    </ContentCard>
  );
};
