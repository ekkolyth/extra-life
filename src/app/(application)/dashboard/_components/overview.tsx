'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Users, BanknoteIcon, Trophy } from 'lucide-react';
import Image from 'next/image';
import type { Donor } from '@/utils/donor-drive-api-client';
import type { Goal } from '@/types/db';

// Loading component for individual values
function LoadingValue({ className = "h-8 w-24" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted rounded ${className}`} />
  );
}
interface OverviewProps {
  data: {
    sumDonations: number;
    fundraisingGoal: number;
    numDonations: number;
    numIncentives: number;
    numMilestones: number;
  };
  topDonor?: Donor | null;
  goals?: Goal[];
  isLoading?: boolean;
}

export function Overview({ data, topDonor, goals = [], isLoading = false }: OverviewProps) {
  const totalRaised = data.sumDonations;
  const goal = data.fundraisingGoal;
  const progressPercentage = goal > 0 ? (totalRaised / goal) * 100 : 0;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  // Find next goal based on current total raised
  const nextGoalIndex = goals.findIndex((g) => g.amount > totalRaised);
  const nextGoal = nextGoalIndex >= 0 ? goals[nextGoalIndex] : null;
  const progressToNext = nextGoal ? (totalRaised / nextGoal.amount) * 100 : 0;

  return (
    <div className='space-y-6'>
      <Card className='border-border/50 bg-card/50 backdrop-blur-sm'>
        <CardHeader className='pb-3'>
          <CardTitle className='flex items-center gap-2 text-xl'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10'>
              <DollarSign className='h-4 w-4 text-primary' />
            </div>
            Total Raised YTD
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-4'>
            <div className='flex items-baseline gap-3'>
              {isLoading ? (
                <LoadingValue className="h-12 w-32" />
              ) : (
                <span className='text-5xl font-bold tracking-tight text-foreground'>
                  ${totalRaised.toFixed(2)}
                </span>
              )}
              <div className='flex flex-col'>
                {isLoading ? (
                  <>
                    <LoadingValue className="h-6 w-20" />
                    <LoadingValue className="h-4 w-24 mt-1" />
                  </>
                ) : (
                  <>
                    <span className='text-lg text-muted-foreground'>of ${goal.toLocaleString()}</span>
                    <span className='text-sm text-primary font-medium'>
                      +${totalRaised.toFixed(2)} this month
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className='space-y-2'>
              {isLoading ? (
                <LoadingValue className="h-2 w-full" />
              ) : (
                <Progress
                  value={progressPercentage}
                  className='h-2'
                />
              )}
              <div className='flex justify-between text-sm'>
                {isLoading ? (
                  <>
                    <LoadingValue className="h-4 w-20" />
                    <LoadingValue className="h-4 w-24" />
                  </>
                ) : (
                  <>
                    <span className='text-muted-foreground'>
                      {progressPercentage.toFixed(1)}% complete
                    </span>
                    <span className='text-muted-foreground'>
                      ${(goal - totalRaised).toLocaleString()} remaining
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats grid with modern design */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        {/* Total Donations Card */}
        <Card className='border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-colors flex flex-col'>
          <CardContent className='p-4 flex flex-col flex-1 justify-between'>
            <div className='flex items-center justify-start'>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                <Users className='h-6 w-6 text-primary' />
              </div>
            </div>
            <div className='flex flex-col gap-1 flex-1 justify-end'>
              {isLoading ? (
                <>
                  <LoadingValue className="h-10 w-24" />
                  <LoadingValue className="h-4 w-32" />
                </>
              ) : (
                <>
                  <p className='text-4xl font-bold text-foreground leading-tight'>{data.numDonations}</p>
                  <p className='text-sm text-muted-foreground font-medium'>Total Donations</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Top Donor Card - matches the style of other stat cards */}
        <Card className='border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-colors flex flex-col'>
          <CardContent className='p-4 flex flex-col flex-1 justify-between'>
            <div className='flex items-center justify-between'>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                <BanknoteIcon className='h-6 w-6 text-primary' />
              </div>
              {isLoading || !topDonor ? (
                <LoadingValue className="h-4 w-20" />
              ) : (
                <span className='text-lg font-semibold text-muted-foreground truncate max-w-[120px]'>
                  {topDonor.displayName || 'Anonymous'}
                </span>
              )}
            </div>
            <div className='flex flex-col gap-1 flex-1 justify-end'>
              {isLoading || !topDonor ? (
                <>
                  <LoadingValue className="h-10 w-24" />
                  <LoadingValue className="h-4 w-32" />
                </>
              ) : (
                <>
                  {topDonor.avatarImageURL && (
                    <div className='mb-1'>
                      <Image
                        src={topDonor.avatarImageURL}
                        alt={topDonor.displayName || 'Top Donor'}
                        width={32}
                        height={32}
                        className='rounded-full'
                      />
                    </div>
                  )}
                  <p className='text-4xl font-bold text-foreground leading-tight'>
                    {formatter.format(topDonor.sumDonations ?? 0)}
                  </p>
                  <p className='text-sm text-muted-foreground font-medium'>
                    {topDonor.numDonations} {topDonor.numDonations === 1 ? 'donation' : 'donations'}
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Next Goal Card - spans 2 columns */}
        <Card className='border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 backdrop-blur-sm flex flex-col lg:col-span-2'>
          <CardContent className='p-4 flex flex-col flex-1 justify-between'>
            <div className='flex items-center gap-3 mb-2'>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20'>
                <Trophy className='h-6 w-6 text-primary' />
              </div>
              <div>
                <span className='text-xs font-medium text-primary'>Next Goal</span>
                {isLoading || !nextGoal ? (
                  <LoadingValue className="h-6 w-32 mt-1" />
                ) : (
                  <h3 className='text-xl font-bold text-foreground'>{nextGoal.title}</h3>
                )}
              </div>
            </div>
            {isLoading || !nextGoal ? (
              <LoadingValue className="h-3 w-24 mb-2" />
            ) : (
              <p className='text-xs text-muted-foreground mb-2'>
                {nextGoal.endOfStream ? 'End of Stream Goal' : 'Donation Goal'}
              </p>
            )}
            <div className='flex flex-col gap-1 flex-1 justify-end'>
              <div className='flex justify-between text-xs mb-2'>
                {isLoading ? (
                  <>
                    <LoadingValue className="h-3 w-20" />
                    <LoadingValue className="h-3 w-20" />
                  </>
                ) : (
                  <>
                    <span className='text-muted-foreground'>${totalRaised.toFixed(2)} raised</span>
                    <span className='font-medium'>${nextGoal?.amount.toLocaleString() || '0'} target</span>
                  </>
                )}
              </div>
              {isLoading ? (
                <LoadingValue className="h-2 w-full" />
              ) : (
                <Progress value={progressToNext} className='h-2' />
              )}
              {isLoading ? (
                <LoadingValue className="h-3 w-16 mt-1" />
              ) : (
                <p className='text-xs text-muted-foreground mt-1'>{progressToNext.toFixed(1)}% complete</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
