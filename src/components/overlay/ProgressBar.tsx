import { useEffect } from 'react'
import { useQuery } from 'react-query'
import LurkMerch from '../../assets/img/lurk-merch.png'
import Scolei from '../../assets/img/scolei.png'

import { fetchStats, formatter, percentage } from '../../utils/donorDrive'
import { classNames } from '../../utils/style'

const ProgressBar = () => {
  const { data, error } = useQuery(['extralife', 'donors'], () => fetchStats('478888'))
  const donationPercentage = percentage(data?.sumDonations, data?.fundraisingGoal)

  useEffect(() => {
    console.log('Fetching Donor Data Failed!\n', error)
  }, [error])

  return (
    <div
      style={{ width: 934 }}
      className='bg-gray-600 border-8 border-black text-white rounded-full text-3xl font-bold text-center relative'>
      <div className='overflow-hidden rounded-full'>
        <div className='h-16 bg-purple-bar-1 rounded-full' style={{ width: `${donationPercentage}%` }}></div>
      </div>
      <div className='absolute inset-0 flex items-center justify-center'>
        <p>{formatter.format(data?.sumDonations)}</p>
      </div>
      <div
        className={classNames(
          donationPercentage >= 100 ? 'w-32 h-32 right-48' : 'w-16 h-16 right-60',
          'absolute bottom-0'
        )}>
        <img src={donationPercentage >= 100 ? Scolei.src : LurkMerch.src} />
      </div>
    </div>
  )
}

export default ProgressBar
