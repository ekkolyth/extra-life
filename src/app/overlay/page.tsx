'use client'

import Confetti from 'react-confetti'
import { useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import TopRotator from 'src/components/overlay/top-rotator'
import ProgressBar from 'src/components/overlay/progress-bar'
import TimeLeft from 'src/components/overlay/time-left'
import { WheelSpins } from 'src/components/overlay/wheel-spins'
import { Donation, fetchLatestDonations, formatter } from 'src/utils/donor-drive'
import { useQuery } from 'react-query'
import dayjs from 'dayjs'

const Overlay = () => {
  const [alerts, setAlerts] = useState<Donation[]>([])
  const [donationAlert, setDonationAlert] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [timesUp, setTimesUp] = useState(false)
  const [panel, setPanel] = useState('timeLeft')

  useQuery(
    ['extralife', 'latestDonations', 'alerts'],
    () => fetchLatestDonations(String(process.env.NEXT_PUBLIC_DONORDRIVE_ID), 10),
    {
      refetchInterval: 30000,
      onSuccess(data) {
        // If any of the donations are over $100, add them to the alerts queue
        const newAlerts = data.filter(
          donation => donation.amount >= 100 && dayjs(donation.createdDateUTC).isAfter(dayjs().subtract(30, 'seconds'))
        )
        setAlerts(alerts => [...alerts, ...newAlerts])
      }
    }
  )

  // Display time left for 5 seconds, then switch to wheel spins for 10 seconds, then repeat
  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (panel === 'timeLeft') {
          setPanel('wheelSpins')
        } else {
          setPanel('timeLeft')
        }
      },
      panel === 'wheelSpins' ? 5000 : 10000
    )
    return () => clearTimeout(timer)
  }, [panel])

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

  // If there are any alerts in the queue, enable the donation
  // alert for each one one at a time for 20 seconds each
  useEffect(() => {
    if (alerts.length > 0) {
      setDonationAlert(true)
      setTimeout(() => {
        setDonationAlert(false)
        alerts.pop()
      }, 15000)
    }
  }, [alerts])

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
      <Transition
        show={donationAlert}
        enter='transition-opacity duration-1000 delay-alert'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='transition-opacity duration-200'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'>
        <div className='absolute top-0 left-0 w-full h-full flex items-start justify-center pt-44'>
          {alerts.length > 0 && (
            <div className='font-display'>
              <h1 className='text-6xl text-center font-bold text-purple-bar-1'>
                {alerts[0]?.displayName} donated {formatter.format(alerts[0]?.amount ?? 0)}!
              </h1>
              <p className='text-3xl text-center text-gray-900'>{alerts[0]?.message}</p>
            </div>
          )}
        </div>
      </Transition>
      <Transition
        show={donationAlert}
        enter='transition-opacity duration-1000'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='transition-opacity duration-200'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'>
        <video width='1920' height='1080' autoPlay>
          <source src='/assets/vid/big-alert.webm' type='video/webm' />
        </video>
      </Transition>
      <div className='absolute top-12 left-0 right-0 w-full flex justify-center'>
        <TopRotator />
      </div>
      <div className='absolute bottom-12 left-0 right-0 w-full flex justify-center'>
        <ProgressBar />
      </div>
      <div className='absolute bottom-14 right-12'>
        <div className='bg-purple-bar-1 w-72 rounded-xl py-4 px-6 shadow-super relative'>
          <TimeLeft visible={panel === 'timeLeft'} timesUp={value => setTimesUp(value)} />
          <WheelSpins visible={panel === 'wheelSpins'} />
        </div>
      </div>
    </div>
  )
}
export default Overlay
