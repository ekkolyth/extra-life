import { useEffect } from 'react'
import { useQuery } from 'react-query'
import LurkMerch from '@/assets/img/lurk-merch.png'
import Scolei from '@/assets/img/scolei.png'

import { fetchStats, formatter, percentage } from 'src/utils/donor-drive'
import { cn } from 'src/utils/style'

const ProgressBar = () => {
  const { data, error } = useQuery(
    ['extralife', 'donors'],
    () => fetchStats(String(process.env.NEXT_PUBLIC_DONORDRIVE_ID)),
    {
      refetchInterval: 5000
    }
  )

  useEffect(() => {
    console.log('Fetching Donor Data Failed!\n', error)
  }, [error])

  if (data?.sumDonations === undefined) {
    return null
  }

  const donationPercentage = percentage(data?.sumDonations, data?.fundraisingGoal)

  return (
    <div
      style={{ width: 960 }}
      className='bg-gray-600 border-4 text-white shadow-super rounded-full text-3xl font-bold text-center relative'>
      <div className='overflow-hidden rounded-full'>
        <div className='h-16 bg-primary rounded-full' style={{ width: `${donationPercentage}%` }}></div>
      </div>
      <div className='absolute inset-0 flex items-center justify-center'>
        <p>{formatter.format(data?.sumDonations)}</p>
      </div>
      <div className={cn(donationPercentage >= 100 ? 'w-32 h-32 right-48' : 'w-16 h-16 right-60', 'absolute bottom-0')}>
        <img src={donationPercentage >= 100 ? Scolei.src : LurkMerch.src} />
      </div>
    </div>
  )
}

export default ProgressBar
