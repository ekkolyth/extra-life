'use client';

import { useDonorDrive } from '@/hooks/useDonorDrive';
import { Progress } from '@/components/ui/progress';

const ProgressBar = () => {
  const { data: donorDriveData, isLoading, error } = useDonorDrive();

  if (isLoading) {
    return <div className='w-full h-2 bg-gray-200 rounded animate-pulse' />;
  }

  if (error) {
    return <div className='w-full h-2 bg-red-200 rounded' />;
  }

  const donations = donorDriveData?.sumDonations || 0;
  const goal = donorDriveData?.fundraisingGoal || 2000;
  const donationPercentage = (donations / goal) * 100;

  return (
    <div
      style={{ width: 960 }}
      className='bg-gray-800 border-4 text-white shadow-super rounded-full text-3xl font-bold text-center relative'
    >
      <Progress
        className='h-16 w-full'
        value={donationPercentage}
      />
      <div className='absolute inset-0 flex items-center justify-center'>
        <p>${donations.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ProgressBar;
