'use client';

import type { Goal } from '@/types/db';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useQuery as useConvexQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { fetchTopDonation, fetchTopDonor, fetchStats } from '@/utils/donor-drive';

interface TopRotatorProps {
  goals: Goal[];
}

export function RightText(props: TopRotatorProps) {
  const { goals } = props;
  const [index, setIndex] = useState(0);
  const [nextGoal, setNextGoal] = useState<Goal | null>(null);

  // Use TanStack Query for external API calls (donor-drive)
  const { data: topDonation } = useQuery({
    queryKey: ['topDonation'],
    queryFn: () => fetchTopDonation(String(process.env.NEXT_PUBLIC_DONORDRIVE_ID)),
  });
  const { data: topDonor } = useQuery({
    queryKey: ['topDonor'],
    queryFn: () => fetchTopDonor(String(process.env.NEXT_PUBLIC_DONORDRIVE_ID)),
  });
  const { data: stats } = useQuery({
    queryKey: 'stats',
    queryFn: () => fetchStats(String(process.env.NEXT_PUBLIC_DONORDRIVE_ID)),
    refetchInterval: 15000,
  });

  // Use Convex for database queries
  const segments = useConvexQuery(api.segment.list) || [];
  const { currentSegment, nextSegment } = useSegments(segments);

  useEffect(() => {
    if (stats && stats !== 'Rate limited' && goals && goals.length) {
      setNextGoal(goals?.find((goal) => goal.amount > stats.sumDonations) ?? null);
    }
  }, [stats, goals]);

  const bonusText: { label: string; text: string }[] = [
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
      text: topDonation
        ? `${
            typeof topDonation !== 'string' ? topDonation?.displayName ?? 'Anonymous' : 'Your Mom'
          } - $${typeof topDonation !== 'string' ? topDonation?.amount : '69'}`
        : '',
    },
    {
      label: 'top donator',
      text: topDonor ? `${typeof topDonor !== 'string' ? topDonor?.displayName : 'Your Mom'}` : '',
    },
    {
      label: 'next goal unlock',
      text: nextGoal ? `${nextGoal?.title}${nextGoal?.endOfStream ? ` - End Of Stream` : ''}` : '',
    },
  ];
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
