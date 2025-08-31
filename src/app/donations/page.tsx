'use client'

import { useQuery } from 'react-query'
import { fetchStats, formatter } from 'src/utils/donor-drive'

export default function DonationsPage() {
  const { data: stats } = useQuery(
    'stats',
    () => fetchStats(String(process.env.NEXT_PUBLIC_DONORDRIVE_ID)),
    {
      refetchInterval: 15000
    }
  )

  return (
    <div style={{ width: 1920, height: 1080 }} className='bg-grid-pattern relative'>
      <div className='absolute inset-0 flex items-center justify-center'>
        {typeof stats !== 'string' && (
          <h1 className='text-10xl font-bold font-display text-white'>{formatter.format(stats?.sumDonations ?? 0)}</h1>
        )}
      </div>
      <div className='w-full h-full bg-[#5D41DE] mix-blend-color'></div>
    </div>
  )
}
