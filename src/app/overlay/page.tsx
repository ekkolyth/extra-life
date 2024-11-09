'use client'

import type { Goal } from '@prisma/client'

import * as Ably from 'ably'
import dayjs from 'dayjs'
import Confetti from 'react-confetti'
import { useQuery } from 'react-query'
import ReactPlayer from 'react-player/lazy'
import { useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import { useSearchParams } from 'next/navigation'

import { ably } from '@/lib/ably'
import TimeLeft from 'src/components/overlay/time-left'
import TopRotator from 'src/components/overlay/top-rotator'
import { Randomizer } from '@/components/overlay/randomizer'
import ProgressBar from 'src/components/overlay/progress-bar'
import { WheelSpins } from 'src/components/overlay/wheel-spins'
import { Donation, fetchLatestDonations, formatter } from 'src/utils/donor-drive'

const Overlay = () => {
  const searchParams = useSearchParams()
  const limited = searchParams.get('limited') === 'true'

  // Rotator State
  const [panel, setPanel] = useState('timeLeft')
  const [goals, setGoals] = useState<Goal[]>([])
  const [alerts, setAlerts] = useState<Donation[]>([])

  // Alerts
  const [playing, setPlaying] = useState(false)
  const [donationAlert, setDonationAlert] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [timesUp, setTimesUp] = useState(false)

  // Ably
  const [channel] = useState<Ably.Types.RealtimeChannelPromise | null>(ably.channels.get('randomizers'))
  useEffect(() => {
    channel?.subscribe('donation', (msg: Ably.Types.Message) => {
      switch (msg.name) {
        case 'donation':
          setAlerts(alerts => [...alerts, msg.data])
          break
        default:
          console.log(msg.name)
      }
    })
  }, [])

  useQuery(
    ['extralife', 'latestDonations', 'alerts'],
    () => fetchLatestDonations(String(process.env.NEXT_PUBLIC_DONORDRIVE_ID), 10),
    {
      refetchInterval: 30000,
      onSuccess(data) {
        // If any of the donations are over $100, add them to the alerts queue
        const newAlerts =
          typeof data !== 'string'
            ? data.filter(
                donation =>
                  donation.amount >= 100 && dayjs(donation.createdDateUTC).isAfter(dayjs().subtract(30, 'seconds'))
              )
            : []
        setAlerts(alerts => [...alerts, ...newAlerts])
      }
    }
  )

  useQuery(['goals'], () => fetch('/api/goals').then(res => res.json()), {
    refetchInterval: 30000,
    onSuccess(data) {
      setGoals(data)
    }
  })

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
      const timeout = setTimeout(() => {
        setConfetti(false)
      }, 30000)

      return () => clearTimeout(timeout)
    }
  }, [timesUp])

  // If there are any alerts in the queue, enable the donation
  // alert for each one one at a time for 20 seconds each
  useEffect(() => {
    function handleVideoEnd() {
      setPlaying(false)
      setDonationAlert(false)
      setAlerts(alerts => alerts.slice(1))
    }

    if (alerts.length > 0) {
      // Filter alerts to only show one per user
      const uniqueAlerts = alerts.filter(
        (alert, index, self) => index === self.findIndex(t => t.displayName === alert.displayName)
      )
      setAlerts(uniqueAlerts)
      setDonationAlert(true)

      // After a half second, start the video
      const playingTimeout = setTimeout(() => {
        setPlaying(true)
      }, 500)

      // After 20 seconds, stop the video
      const endTimeout = setTimeout(() => {
        handleVideoEnd()
      }, 20000)

      return () => {
        clearTimeout(playingTimeout)
        clearTimeout(endTimeout)
      }
    }
  }, [alerts.length])

  return (
    <div style={{ width: 1920, height: 1080 }} className='relative'>
      {/* Confetti */}
      {!limited && (
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
      )}
      {/* donation alert */}
      <Transition
        show={donationAlert}
        enter='transition-opacity duration-1000'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='transition-opacity duration-1000'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'>
        <div>
          <div className='absolute inset-0 flex items-start justify-center pt-52 bg-black/10'>
            {alerts.length > 0 && (
              <div className='font-display'>
                <h1 className='text-6xl text-center font-bold text-primary'>
                  {alerts[0]?.displayName} donated {formatter.format(alerts[0]?.amount ?? 0)}!
                </h1>
                <p className='text-3xl text-center text-gray-900'>{alerts[0]?.message}</p>
              </div>
            )}
          </div>
          <ReactPlayer
            // controls={true}
            className='z-50'
            playing={playing}
            url='/assets/vid/big-alert.webm'
            width={1920}
            height={1080}
          />
        </div>
      </Transition>
      {/* Top Rotator */}
      {!limited && (
        <div className='absolute top-12 left-0 right-0 w-full flex justify-center'>
          <TopRotator goals={goals} />
        </div>
      )}
      {/* Progress Bar */}
      {!limited && (
        <div className='absolute bottom-12 left-0 right-0 w-full flex justify-center'>
          <ProgressBar />
        </div>
      )}
      {/* Bottom Right Panel */}
      {!limited && (
        <div className='absolute bottom-14 right-12'>
          <div className='bg-primary w-72 rounded-xl py-4 px-6 shadow-super relative'>
            <TimeLeft visible={panel === 'timeLeft'} timesUp={value => setTimesUp(value)} />
            <WheelSpins visible={panel === 'wheelSpins'} />
          </div>
        </div>
      )}
      {/* Randomizer View */}
      {!limited && <Randomizer setConfetti={setConfetti} />}
    </div>
  )
}
export default Overlay
