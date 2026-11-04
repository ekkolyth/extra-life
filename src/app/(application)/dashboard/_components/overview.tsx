'use client'

import { BanknoteIcon, DollarSign, Trophy, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { Goal } from '@/types/db'
import type { Donor } from '@/types/donor-drive'

// Loading component for individual values
function LoadingValue({ className = 'h-8 w-24' }: { className?: string }) {
    return <div className={`animate-pulse bg-muted rounded ${className}`} />
}
interface OverviewProps {
    data: {
        sumDonations: number
        fundraisingGoal: number
        numDonations: number
    }
    goals?: Goal[]
    isLoading?: boolean
    topDonor?: Donor | null
}

export function Overview({
    data,
    topDonor,
    goals = [],
    isLoading = false,
}: OverviewProps) {
    const totalRaised = data.sumDonations
    const goal = data.fundraisingGoal
    const progressPercentage = goal > 0 ? (totalRaised / goal) * 100 : 0

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    })

    // Find next goal based on current total raised
    const nextGoalIndex = goals.findIndex((g) => g.amount > totalRaised)
    const nextGoal = nextGoalIndex >= 0 ? goals[nextGoalIndex] : null
    const progressToNext = nextGoal ? (totalRaised / nextGoal.amount) * 100 : 0

    return (
        <div className='flex flex-col gap-6'>
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <div className='flex size-8 shrink-0 items-center justify-center rounded-sm border'>
                            <DollarSign className='size-4 text-primary' />
                        </div>
                        <span className='truncate'>Total Raised YTD</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col gap-4'>
                    <div className='flex flex-wrap items-baseline gap-x-3 gap-y-1'>
                        {isLoading ? (
                            <LoadingValue className='h-10 w-40' />
                        ) : (
                            <p className='text-4xl font-semibold tracking-tight tabular-nums text-foreground'>
                                ${totalRaised.toFixed(2)}
                            </p>
                        )}
                        <div className='flex flex-col gap-1 text-base sm:text-sm tabular-nums'>
                            {isLoading ? (
                                <>
                                    <LoadingValue className='h-5 w-20' />
                                    <LoadingValue className='h-4 w-24' />
                                </>
                            ) : (
                                <>
                                    <p className='text-muted-foreground'>
                                        of ${goal.toLocaleString()}
                                    </p>
                                    <p className='font-medium text-primary'>
                                        +${totalRaised.toFixed(2)} this month
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        {isLoading ? (
                            <LoadingValue className='h-2 w-full' />
                        ) : (
                            <Progress value={progressPercentage} />
                        )}
                        <div className='flex justify-between gap-4 text-base sm:text-sm text-muted-foreground tabular-nums'>
                            {isLoading ? (
                                <>
                                    <LoadingValue className='h-4 w-20' />
                                    <LoadingValue className='h-4 w-24' />
                                </>
                            ) : (
                                <>
                                    <p>
                                        {progressPercentage.toFixed(1)}%
                                        complete
                                    </p>
                                    <p>
                                        ${(goal - totalRaised).toLocaleString()}{' '}
                                        remaining
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className='@container'>
                <div className='grid grid-cols-1 gap-6 @lg:grid-cols-2 @4xl:grid-cols-4'>
                    <Card>
                        <CardContent className='flex flex-1 flex-col justify-between gap-4'>
                            <div className='flex size-8 shrink-0 items-center justify-center rounded-sm border'>
                                <Users className='size-4 text-primary' />
                            </div>
                            <div className='flex flex-col gap-1'>
                                {isLoading ? (
                                    <>
                                        <LoadingValue className='h-8 w-20' />
                                        <LoadingValue className='h-4 w-28' />
                                    </>
                                ) : (
                                    <>
                                        <p className='text-3xl sm:text-2xl font-semibold tabular-nums text-foreground'>
                                            {data.numDonations}
                                        </p>
                                        <p className='truncate text-base sm:text-sm text-muted-foreground'>
                                            Total Donations
                                        </p>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className='flex flex-1 flex-col justify-between gap-4'>
                            <div className='flex items-center gap-2'>
                                <div className='flex size-8 shrink-0 items-center justify-center rounded-sm border'>
                                    <BanknoteIcon className='size-4 text-primary' />
                                </div>
                                {isLoading || !topDonor ? (
                                    <LoadingValue className='h-4 w-20' />
                                ) : (
                                    <p className='min-w-0 truncate text-base sm:text-sm font-medium text-muted-foreground'>
                                        {topDonor.displayName || 'Anonymous'}
                                    </p>
                                )}
                            </div>
                            <div className='flex flex-col gap-1'>
                                {isLoading || !topDonor ? (
                                    <>
                                        <LoadingValue className='h-8 w-28' />
                                        <LoadingValue className='h-4 w-20' />
                                    </>
                                ) : (
                                    <>
                                        <p className='text-3xl sm:text-2xl font-semibold tabular-nums text-foreground'>
                                            {formatter.format(
                                                topDonor.sumDonations ?? 0
                                            )}
                                        </p>
                                        <p className='truncate text-base sm:text-sm text-muted-foreground'>
                                            {topDonor.numDonations}{' '}
                                            {topDonor.numDonations === 1
                                                ? 'donation'
                                                : 'donations'}
                                        </p>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className='@lg:col-span-2'>
                        <CardContent className='flex flex-1 flex-col justify-between gap-4'>
                            <div className='flex min-w-0 flex-col gap-1'>
                                <div className='flex items-center gap-2'>
                                    <div className='flex size-8 shrink-0 items-center justify-center rounded-sm border'>
                                        <Trophy className='size-4 text-primary' />
                                    </div>
                                    <p className='text-base sm:text-sm font-medium text-primary'>
                                        Next Goal
                                    </p>
                                </div>
                                {isLoading || !nextGoal ? (
                                    <LoadingValue className='h-7 w-40' />
                                ) : (
                                    <h3 className='truncate text-lg font-semibold text-foreground'>
                                        {nextGoal.title}
                                    </h3>
                                )}
                            </div>
                            <div className='flex flex-col gap-2'>
                                <div className='flex justify-between gap-4 text-base sm:text-sm tabular-nums'>
                                    {isLoading ? (
                                        <>
                                            <LoadingValue className='h-4 w-20' />
                                            <LoadingValue className='h-4 w-20' />
                                        </>
                                    ) : (
                                        <>
                                            <p className='text-muted-foreground'>
                                                ${totalRaised.toFixed(2)} raised
                                            </p>
                                            <p className='font-medium text-foreground'>
                                                $
                                                {nextGoal?.amount.toLocaleString() ||
                                                    '0'}{' '}
                                                target
                                            </p>
                                        </>
                                    )}
                                </div>
                                {isLoading ? (
                                    <LoadingValue className='h-2 w-full' />
                                ) : (
                                    <Progress value={progressToNext} />
                                )}
                                {isLoading ? (
                                    <LoadingValue className='h-4 w-16' />
                                ) : (
                                    <p className='text-base sm:text-sm text-muted-foreground tabular-nums'>
                                        {progressToNext.toFixed(1)}% complete
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
