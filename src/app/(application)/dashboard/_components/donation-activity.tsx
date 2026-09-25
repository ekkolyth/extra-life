'use client'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
    Award,
    DollarSign,
    ExternalLink,
    Heart,
    TrendingUp,
    Users,
} from 'lucide-react'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart'
import { Donation, Donor, StatsResult } from '@/utils/donor-drive-api-client'

dayjs.extend(relativeTime)

interface DonationActivityProps {
    data: StatsResult
    donations: Donation[]
    topDonor: Donor
}

export function DonationActivity({
    data,
    donations,
    topDonor,
}: DonationActivityProps) {
    const recentDonations = Array.isArray(donations)
        ? donations.slice(0, 5)
        : []

    const donationTrend = [
        { time: '00:00', amount: 0 },
        { time: '04:00', amount: 0 },
        { time: '08:00', amount: 0 },
        { time: '12:00', amount: 0 },
        { time: '16:00', amount: 0 },
        { time: '20:00', amount: 0 },
        { time: '24:00', amount: 0 },
    ]

    const numDonations = data.numDonations
    const sumDonations = data.sumDonations
    const averageDonation = numDonations > 0 ? sumDonations / numDonations : 0
    const topDonation = topDonor ? topDonor.sumDonations : 0

    const donationStats = [
        {
            label: 'Total Donations',
            value: numDonations.toString(),
            icon: Users,
            change: '+0%',
        },
        {
            label: 'Average Donation',
            value: `$${averageDonation.toFixed(2)}`,
            icon: TrendingUp,
            change: '+0%',
        },
        {
            label: 'Top Donation',
            value: `$${topDonation.toFixed(2)}`,
            icon: Award,
            change: '+0%',
        },
    ]

    return (
        <div className='space-y-6'>
            {/* Donation Stats */}
            <div className='grid grid-cols-3 gap-4'>
                {donationStats.map((stat) => (
                    <Card
                        className='border-border/50 bg-card/30 backdrop-blur-sm'
                        key={stat.label}
                    >
                        <CardContent className='p-4'>
                            <div className='flex items-center justify-between mb-2'>
                                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10'>
                                    <stat.icon className='h-4 w-4 text-primary' />
                                </div>
                                <span className='text-xs text-muted-foreground'>
                                    {stat.change}
                                </span>
                            </div>
                            <div>
                                <p className='text-lg font-bold text-foreground'>
                                    {stat.value}
                                </p>
                                <p className='text-xs text-muted-foreground'>
                                    {stat.label}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Donation Trend Chart */}
            <Card className='border-border/50 bg-card/30 backdrop-blur-sm'>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10'>
                            <TrendingUp className='h-4 w-4 text-primary' />
                        </div>
                        Donation Activity (24h)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        className='h-[150px]'
                        config={{
                            amount: {
                                label: 'Donations',
                                color: 'hsl(var(--chart-1))',
                            },
                        }}
                    >
                        <ResponsiveContainer height='100%' width='100%'>
                            <LineChart data={donationTrend}>
                                <XAxis
                                    axisLine={false}
                                    dataKey='time'
                                    tick={{
                                        fill: 'hsl(var(--muted-foreground))',
                                        fontSize: 12,
                                    }}
                                    tickLine={false}
                                />
                                <YAxis
                                    axisLine={false}
                                    tick={{
                                        fill: 'hsl(var(--muted-foreground))',
                                        fontSize: 12,
                                    }}
                                    tickLine={false}
                                />
                                <ChartTooltip
                                    content={<ChartTooltipContent />}
                                />
                                <Line
                                    dataKey='amount'
                                    dot={{
                                        fill: 'hsl(var(--chart-1))',
                                        strokeWidth: 2,
                                        r: 4,
                                    }}
                                    stroke='hsl(var(--chart-1))'
                                    strokeWidth={2}
                                    type='monotone'
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Recent Donations */}
            <Card className='border-border/50 bg-card/30 backdrop-blur-sm'>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10'>
                            <DollarSign className='h-4 w-4 text-primary' />
                        </div>
                        Recent Donations
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    {recentDonations.length === 0 ? (
                        <div className='rounded-lg bg-muted/20 p-8 text-center'>
                            <Heart className='h-12 w-12 text-muted-foreground mx-auto mb-3' />
                            <p className='text-lg font-medium text-foreground mb-1'>
                                No donations yet
                            </p>
                            <p className='text-sm text-muted-foreground'>
                                Share your donation link to get started!
                            </p>
                        </div>
                    ) : (
                        <div className='space-y-3'>
                            {recentDonations.map((donation, index) => (
                                <div
                                    className='flex items-center justify-between p-3 rounded-lg bg-muted/20'
                                    key={
                                        donation.donationID ||
                                        `donation-${index}`
                                    }
                                >
                                    <div className='flex items-center gap-3'>
                                        <div className='h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center'>
                                            <span className='text-xs font-medium text-primary'>
                                                {(donation.displayName || 'A')
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className='text-sm font-medium'>
                                                {donation.displayName ||
                                                    'Anonymous'}
                                            </p>
                                            <p className='text-xs text-muted-foreground'>
                                                {dayjs(
                                                    donation.createdDateUTC
                                                ).fromNow()}
                                            </p>
                                        </div>
                                    </div>
                                    <span className='text-sm font-bold text-primary'>
                                        ${donation.amount.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className='pt-4 border-t border-border/50'>
                        <Button
                            className='w-full bg-transparent hover:bg-primary/5 border-primary/20'
                            size='sm'
                            variant='outline'
                        >
                            <ExternalLink className='h-4 w-4 mr-2' />
                            Go to Extra Life Donations Page
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
