'use client';

import Image from 'next/image';
import { BanknoteIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Donor, fetchTopDonor } from '@/utils/donor-drive-api-client';

// Loading component for individual values
function LoadingValue({ className = "h-8 w-24" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted rounded ${className}`} />
  );
}

interface TopDonorProps {
  data: Donor;
  isLoading?: boolean;
}

export const TopDonor = (props: TopDonorProps) => {
  const { data: topDonor, isLoading = false } = props;
  const [data, setData] = useState<Donor>(topDonor);

  const id = String(process.env.NEXT_PUBLIC_DONORDRIVE_ID);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const result = await fetchTopDonor(id);
          if (result && typeof result === 'object') {
            setData(result);
          }
        } catch (error) {
          console.error('Failed to fetch top donor:', error);
        }
      };

      fetchData();
      const interval = setInterval(fetchData, 15000);
      return () => clearInterval(interval);
    }
  }, [id]);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return data ? (
    <Card className='border-border/50 bg-card/50 backdrop-blur-sm'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <BanknoteIcon className='h-5 w-5' />
          Top Donor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex items-center'>
          <div className='mr-2 flex items-center'>
            {data?.avatarImageURL && (
              <Image
                height={64}
                width={64}
                alt='Top Donor'
                src={data.avatarImageURL}
              />
            )}
          </div>
          <div className='w-full flex justify-between items-center'>
            <div>
              {isLoading ? (
                <>
                  <LoadingValue className="h-5 w-24 mb-1" />
                  <LoadingValue className="h-3 w-16" />
                </>
              ) : (
                <>
                  <p className='font-semibold'>{data?.displayName}</p>
                  <p className='text-xs text-primary'>{data?.numDonations} donations</p>
                </>
              )}
            </div>
            {isLoading ? (
              <LoadingValue className="h-6 w-20" />
            ) : (
              <p className='text-xl font-semibold'>{formatter.format(data?.sumDonations ?? 0)}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <BanknoteIcon className='h-5 w-5' />
          Top Donor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-3xl font-bold text-primary text-center'>No donations data</p>
      </CardContent>
    </Card>
  );
};
