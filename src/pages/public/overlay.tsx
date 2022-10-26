'use client'

import { useQuery } from 'react-query'
import { fetchStats, formatter, percentage } from '../../utils/donorDrive'
import LurkMerch from '../../assets/img/lurk-merch.png'
import Scolei from '../../assets/img/scolei.png'
import TimeLeft from '../../components/overlay/TimeLeft'
import Confetti from 'react-confetti'
import { useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import { classNames } from '../../utils/style'

const Overlay = () => {
  const [confetti, setConfetti] = useState(false)
  const [timesUp, setTimesUp] = useState(false)
  const { data, error, isLoading } = useQuery(['extralife', 'donors'], () => fetchStats('478888'))

  const donationPercentage = percentage(data?.sumDonations, data?.fundraisingGoal)

  // Once times up turns to true, set confetti to true
  // After 1 minute, set confetti to false
  useEffect(() => {
    if (timesUp) {
      setConfetti(true)
      setTimeout(() => {
        setConfetti(false)
      }, 30000)
    }
  }, [timesUp])

  return (
    <div style={{ width: 1920, height: 1080 }} className='relative bg-green-500'>
      <Transition
        show={confetti}
        enter='transition-opacity duration-75'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='transition-opacity duration-1000'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'>
        <Confetti
          width={1920}
          height={1080}
          colors={['#5D41DE', '#0E0E10', '#1D4C6C', '#47C2E2', '#6B4BFF', '#5D41DE']}
        />
      </Transition>
      <div className='absolute bottom-12 left-0 right-0 w-full flex justify-center'>
        <div
          style={{ width: 934 }}
          className='bg-gray-600 border-8 border-black text-white rounded-full text-3xl font-bold text-center relative'>
          <div className='h-16 bg-purple-bar-1 rounded-full' style={{ width: `${donationPercentage}%` }}></div>
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
      </div>
      <div className='absolute bottom-14 right-12'>
        <TimeLeft timesUp={value => setTimesUp(value)} />
      </div>
    </div>
  )
}
export default Overlay
