'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Trophy, CheckCircle, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Goal } from '@/types/db';

// Loading component for individual values
function LoadingValue({ className = "h-8 w-24" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted rounded ${className}`} />
  );
}

interface GoalsSectionProps {
  data: {
    sumDonations: number;
  };
  goals: Goal[];
  isLoading?: boolean;
}

export function GoalsSection({ data, goals, isLoading = false }: GoalsSectionProps) {
  const totalRaised = data.sumDonations;

  // Find next goal based on current total raised
  const nextGoalIndex = goals.findIndex((goal) => goal.amount > totalRaised);
  const nextGoal = nextGoalIndex >= 0 ? goals[nextGoalIndex] : null;
  const progressToNext = nextGoal ? (totalRaised / nextGoal.amount) * 100 : 0;

  return (
    <div className='space-y-6'>
      {/* Next Goal Highlight - Always show the block */}
      <Card className='border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 backdrop-blur-sm'>
        <CardContent className='p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20'>
              <Trophy className='h-5 w-5 text-primary' />
            </div>
            <div>
              <span className='text-sm font-medium text-primary'>Next Goal</span>
              {isLoading || !nextGoal ? (
                <LoadingValue className="h-8 w-32 mt-1" />
              ) : (
                <h3 className='text-2xl font-bold text-foreground'>{nextGoal.title}</h3>
              )}
            </div>
          </div>
          {isLoading || !nextGoal ? (
            <LoadingValue className="h-4 w-24 mb-4" />
          ) : (
            <p className='text-sm text-muted-foreground mb-4'>
              {nextGoal.endOfStream ? 'End of Stream Goal' : 'Donation Goal'}
            </p>
          )}
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              {isLoading ? (
                <>
                  <LoadingValue className="h-4 w-20" />
                  <LoadingValue className="h-4 w-20" />
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
              <Progress
                value={progressToNext}
                className='h-2'
              />
            )}
            {isLoading ? (
              <LoadingValue className="h-3 w-16" />
            ) : (
              <p className='text-xs text-muted-foreground'>{progressToNext.toFixed(1)}% complete</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Goals List */}
      <Card className='border-border/50 bg-card/30 backdrop-blur-sm'>
        <CardHeader>
          <CardTitle className='text-lg'>All Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {goals.map((goal) => {
              const isCompleted = totalRaised >= goal.amount;
              const isNext = goal.id === nextGoal?.id;

              return (
                <div
                  key={goal.id}
                  className='flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors'
                >
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10'>
                      {isCompleted ? (
                        <CheckCircle className='h-4 w-4 text-primary' />
                      ) : isNext ? (
                        <Clock className='h-4 w-4 text-primary' />
                      ) : (
                        <Target className='h-4 w-4 text-muted-foreground' />
                      )}
                    </div>
                    <div>
                      <p className='text-sm font-medium text-foreground'>{goal.title}</p>
                      <p className='text-xs text-muted-foreground'>
                        {goal.endOfStream ? 'End of Stream Goal' : 'Donation Goal'}
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm font-bold text-foreground'>
                      ${goal.amount.toLocaleString()}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      ${Math.min(totalRaised, goal.amount).toFixed(2)} raised
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
