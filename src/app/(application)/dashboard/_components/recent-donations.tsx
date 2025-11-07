'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import Image from 'next/image';
import type { Donation } from '@/utils/donor-drive-api-client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// Loading component for individual values
function LoadingValue({ className = "h-8 w-24" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted rounded ${className}`} />
  );
}

interface RecentDonationsProps {
  donations: Donation[];
  isLoading?: boolean;
}

export function RecentDonations({ donations, isLoading = false }: RecentDonationsProps) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  // Get the 5 most recent donations
  const recentDonations = (donations || []).slice(0, 5);

  return (
    <Card className='border-border/50 bg-card/50 backdrop-blur-sm'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2 text-xl'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10'>
            <DollarSign className='h-4 w-4 text-primary' />
          </div>
          Recent Donations
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        {isLoading ? (
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className='flex items-center justify-between p-3 rounded-lg bg-muted/20'>
                <div className='flex items-center gap-3'>
                  <LoadingValue className="h-10 w-10 rounded-full" />
                  <div className='space-y-1'>
                    <LoadingValue className="h-4 w-24" />
                    <LoadingValue className="h-3 w-16" />
                  </div>
                </div>
                <LoadingValue className="h-5 w-16" />
              </div>
            ))}
          </>
        ) : recentDonations.length === 0 ? (
          <div className='rounded-lg bg-muted/20 p-8 text-center'>
            <p className='text-sm text-muted-foreground'>No donations yet</p>
          </div>
        ) : (
          recentDonations.map((donation, index) => (
            <div
              key={donation.donationID || `donation-${index}`}
              className='flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors'
            >
              <div className='flex items-center gap-3'>
                {donation.avatarImageURL ? (
                  <Image
                    src={donation.avatarImageURL}
                    alt={donation.displayName || 'Donor'}
                    width={40}
                    height={40}
                    className='rounded-full'
                  />
                ) : (
                  <div className='h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center'>
                    <span className='text-sm font-medium text-primary'>
                      {(donation.displayName || 'A').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className='text-sm font-medium text-foreground'>
                    {donation.displayName || 'Anonymous'}
                  </p>
                  {donation.createdDateUTC && (
                    <p className='text-xs text-muted-foreground'>
                      {dayjs(donation.createdDateUTC).fromNow()}
                    </p>
                  )}
                </div>
              </div>
              <span className='text-base font-bold text-primary'>
                {formatter.format(donation.amount || 0)}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

