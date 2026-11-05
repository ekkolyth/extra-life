'use client'

import { useCampaign } from '@/hooks/use-campaign'
import { USDollar } from '@/utils/currency'

export default function CounterPage() {
    const { data: campaign } = useCampaign()

    return (
        <div className='relative h-270 w-480 bg-grid-pattern'>
            <div className='absolute inset-0 flex items-center justify-center'>
                <h1 className='font-display text-10xl font-bold text-white'>
                    {USDollar.format(campaign?.sumDonations ?? 0)}
                </h1>
            </div>
            <div className='size-full bg-[#5D41DE] mix-blend-color' />
        </div>
    )
}
