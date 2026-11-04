'use client'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { DollarSign } from 'lucide-react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Donation } from '@/types/donor-drive'

dayjs.extend(relativeTime)

// Loading component for individual values
function LoadingValue({ className = 'h-8 w-24' }: { className?: string }) {
    return <div className={`animate-pulse bg-muted rounded ${className}`} />
}

interface RecentDonationsProps {
    donations: Donation[]
    isLoading?: boolean
}

export function RecentDonations({
    donations,
    isLoading = false,
}: RecentDonationsProps) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    })

    // Get the 5 most recent donations
    const recentDonations = (donations || []).slice(0, 5)

    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <div className='flex size-8 shrink-0 items-center justify-center rounded-sm border'>
                        <DollarSign className='size-4 text-primary' />
                    </div>
                    Recent Donations
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <ul className='divide-y'>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <li
                                className='flex items-center gap-3 py-3 first:pt-0 last:pb-0'
                                key={i}
                            >
                                <LoadingValue className='size-8 shrink-0 rounded-full' />
                                <div className='flex min-w-0 flex-1 flex-col gap-1'>
                                    <LoadingValue className='h-4 w-24' />
                                    <LoadingValue className='h-3 w-16' />
                                </div>
                                <LoadingValue className='h-4 w-14' />
                            </li>
                        ))}
                    </ul>
                ) : recentDonations.length === 0 ? (
                    <p className='py-6 text-center text-base sm:text-sm text-muted-foreground'>
                        No donations yet
                    </p>
                ) : (
                    <ul className='divide-y'>
                        {recentDonations.map((donation, index) => (
                            <li
                                className='flex items-center gap-3 py-3 first:pt-0 last:pb-0'
                                key={donation.donationID || `donation-${index}`}
                            >
                                {donation.avatarImageURL ? (
                                    <Image
                                        alt={donation.displayName || 'Donor'}
                                        className='size-8 shrink-0 rounded-full'
                                        height={32}
                                        src={donation.avatarImageURL}
                                        width={32}
                                    />
                                ) : (
                                    <div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary'>
                                        {(donation.displayName || 'A')
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                )}
                                <div className='min-w-0 flex-1'>
                                    <p className='truncate text-base sm:text-sm font-medium text-foreground'>
                                        {donation.displayName || 'Anonymous'}
                                    </p>
                                    <p className='text-sm text-muted-foreground'>
                                        {dayjs(donation.createdAt).fromNow()}
                                    </p>
                                </div>
                                <p className='shrink-0 text-base sm:text-sm font-semibold tabular-nums text-primary'>
                                    {formatter.format(donation.amount || 0)}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    )
}
