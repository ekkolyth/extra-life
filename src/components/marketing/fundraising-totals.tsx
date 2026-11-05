'use client'

import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { USDollar } from '@/utils/currency'

export function FundraisingTotals() {
    const { data } = useQuery(convexQuery(api.donations.totalsByYear, {}))
    const firstYear = data?.years.length
        ? Math.min(...data.years.map((item) => item.year))
        : undefined

    return (
        <>
            {/* Total Fundraising Card */}
            <Card className='bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0'>
                <CardContent className='p-6 text-center'>
                    <div className='text-4xl font-bold mb-2 tabular-nums'>
                        {data ? (
                            USDollar.format(data.total)
                        ) : (
                            <Skeleton className='h-10 w-48 mx-auto bg-white/20' />
                        )}
                    </div>
                    <div className='text-lg opacity-90'>
                        Total Raised Since{' '}
                        {data ? (
                            firstYear
                        ) : (
                            <Skeleton className='inline-block h-5 w-12 align-middle bg-white/20' />
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Fundraising Totals */}
            <Card>
                <CardHeader>
                    <CardTitle className='text-lg'>
                        Fundraising Totals
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='space-y-3'>
                        {data ? (
                            data.years.map((item) => (
                                <div
                                    className='flex justify-between items-center'
                                    key={item.year}
                                >
                                    <span className='font-medium text-blue-600 dark:text-blue-400'>
                                        {item.year}
                                    </span>
                                    <span className='font-bold text-foreground tabular-nums'>
                                        {USDollar.format(item.total)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <Skeleton className='h-6 w-full' />
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
