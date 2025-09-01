'use client';

import dayjs from 'dayjs';
import Link from 'next/link';
import Image from 'next/image';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ChevronRightIcon, DollarSignIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import ContentCard from './card';
import { Donation, fetchLatestDonations } from '@/utils/donor-drive';
import { Button } from '@/components/ui/button';

dayjs.extend(relativeTime);

interface LatestDonationsProps {
  data: Donation[];
}

export const LatestDonations = (props: LatestDonationsProps) => {
  const { data: donations } = props;
  const [data, setData] = useState<Donation[]>(donations);

  const id = String(process.env.NEXT_PUBLIC_DONORDRIVE_ID);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const result = await fetchLatestDonations(id, 10);
          if (typeof result !== 'string') {
            setData(result);
          }
        } catch (error) {
          console.error('Failed to fetch donations:', error);
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

  return (
    <ContentCard title='Latest Donations' icon={<DollarSignIcon />}>
      <ol className='my-4 flex flex-col divide-y divide-border'>
        {Array.isArray(data) &&
          data.length &&
          data.map((d) => (
            <li key={d.donationID} className='flex flex-wrap py-3'>
              <div className='mr-2 flex items-center'>
                {d.avatarImageURL && (
                  <Image
                    height={32}
                    width={32}
                    alt='Top Donor'
                    className='rounded-full'
                    src={d.avatarImageURL}
                  />
                )}
              </div>
              <div className='flex flex-grow justify-between items-center'>
                <div>
                  <p className='font-semibold'>{d.displayName ?? 'Anonymous'}</p>
                  <p className='text-xs -mt-1 text-primary'>{dayjs(d.createdDateUTC).fromNow()}</p>
                </div>
                <p className='font-semibold'>{formatter.format(d.amount)}</p>
              </div>
              <div className='w-full mt-2'>
                {d.message && <p className='text-xs'>{d.message}</p>}
              </div>
            </li>
          ))}
      </ol>
      <Button variant='link' className='w-full' asChild>
        <Link
          href='https://www.extra-life.org/index.cfm?fuseaction=portal.donations'
          target='_blank'
          rel='noreferrer'
        >
          Go to Extra Life Donations Page <ChevronRightIcon className='w-4 h-4' />
        </Link>
      </Button>
    </ContentCard>
  );
};
