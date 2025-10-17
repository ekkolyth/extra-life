'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DollarSign, TrendingUp, Users, Calendar, Target } from 'lucide-react';

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
  isLoading?: boolean;
}

export function Overview({ data, isLoading = false }: OverviewProps) {
  const totalRaised = data.sumDonations;
  const goal = data.fundraisingGoal;
  const progressPercentage = goal > 0 ? (totalRaised / goal) * 100 : 0;

  const stats = [
    {
      name: 'Fundraising Goal',
      value: `$${goal.toLocaleString()}`,
      icon: Target,
      change: '+0%',
    },
    {
      name: 'Total Donations',
      value: data.numDonations.toString(),
      icon: Users,
      change: '+0%',
    },
    {
      name: 'Active Incentives',
      value: data.numIncentives.toString(),
      icon: TrendingUp,
      change: '+0%',
    },
    {
      name: 'Milestones Hit',
      value: `${data.numMilestones}/4`,
      icon: Calendar,
      change: '0%',
    },
  ];

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
        {stats.map((stat) => (
          <Card
            key={stat.name}
            className='border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-colors'
          >
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10'>
                  <stat.icon className='h-5 w-5 text-primary' />
                </div>
                <span className='text-xs text-muted-foreground'>{stat.change}</span>
              </div>
              <div className='mt-3 space-y-1'>
                {isLoading ? (
                  <LoadingValue className="h-8 w-16" />
                ) : (
                  <p className='text-2xl font-bold text-foreground'>{stat.value}</p>
                )}
                <p className='text-xs text-muted-foreground'>{stat.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
