'use client'

import { BanknotesIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Card from './card'
import { Donor, StatsResult, fetchStats, fetchTopDonor } from '@/utils/donor-drive'
import { useQuery } from 'react-query'

interface TopDonorProps {
  data: Donor
}

export const TopDonor = (props: TopDonorProps) => {
  const { data: topDonor } = props

  const id = String(process.env.NEXT_PUBLIC_DONORDRIVE_ID)
  const { data } = useQuery('topDonor', () => fetchTopDonor(id), {
    initialData: topDonor,
    enabled: !!id,
    refetchInterval: 15000
  })

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })

  return typeof data !== 'string' ? (
    <Card title='Top Donor' icon={<BanknotesIcon />}>
      <div className='flex items-center'>
        <div className='mr-2 flex items-center'>
          {data?.avatarImageURL && <Image height={64} width={64} alt='Top Donor' src={data.avatarImageURL} />}
        </div>
        <div className='w-full flex justify-between items-center'>
          <div>
            <p className='font-semibold'>{data?.displayName}</p>
            <p className='text-xs text-primary'>{data?.numDonations} donations</p>
          </div>
          <p className='text-xl font-semibold'>{formatter.format(data?.sumDonations ?? 0)}</p>
        </div>
      </div>
    </Card>
  ) : (
    <Card title='Top Donor' icon={<BanknotesIcon />}>
      <p className='text-3xl font-bold text-primary text-center'>No donations data</p>
    </Card>
  )
}
