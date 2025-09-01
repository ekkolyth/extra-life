'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchStatsWithDebug } from '@/utils/donor-drive-debug';
import { useDonorDriveDebug } from '@/utils/donor-drive-debug';
import { Progress } from '../ui/progress';

const ProgressBar = () => {
  const debugMutation = useDonorDriveDebug();

  // Use TanStack Query to fetch donation stats from donor-drive
  // This will respect the 15-second rate limiting
  const { data: stats } = useQuery({
    queryKey: ['donationStats'],
    queryFn: () =>
      fetchStatsWithDebug(String(process.env.NEXT_PUBLIC_DONORDRIVE_ID), debugMutation),
    refetchInterval: 15000, // 15 seconds as requested
  });

  // Use real data if available, fallback to demo data
  const donations = stats && stats !== 'Rate limited' ? stats.sumDonations : 5000;
  const goal = stats && stats !== 'Rate limited' ? stats.fundraisingGoal : 10000;
  const donationPercentage = (donations / goal) * 100;

  return (
    <div
      style={{ width: 960 }}
      className='bg-gray-800 border-4 text-white shadow-super rounded-full text-3xl font-bold text-center relative'
    >
      <Progress className='h-16 w-full' value={donationPercentage} />
      <div className='absolute inset-0 flex items-center justify-center'>
        <p>${donations.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ProgressBar;
