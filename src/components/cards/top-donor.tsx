'use client'

import { BanknotesIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import { useQuery } from 'react-query'
import { fetchTopDonor } from '../../utils/donor-drive'
import Card from './card'

export const TopDonor = () => {
  const { data, error, isLoading } = useQuery(['extralife', 'topDonor'], () =>
    fetchTopDonor(String(process.env.NEXT_PUBLIC_DONORDRIVE_ID))
  )
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })

  if (isLoading)
    return (
      <Card title='Top Donor' icon={<BanknotesIcon />}>
        Loading...
      </Card>
    )
  if (error)
    return (
      <Card title='Top Donor' icon={<BanknotesIcon />}>
        Error
      </Card>
    )

  return (
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
  )
}
