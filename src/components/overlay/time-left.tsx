'use client'

import { setHours } from 'date-fns'
// Display the current countdown to November 13 at 10am in hours, minutes, and seconds
// Bonus fun when we reach zero
import { useEffect, useState } from 'react'
import TextTransition, { presets } from 'react-text-transition'

const eventDateStart = new Date('November 9, 2024 10:00:00')
const eventDateEnd = new Date('November 9, 2024 22:00:00')

const TimeLeft = ({ visible, timesUp }: { visible: boolean; timesUp: (value: boolean) => void }) => {
  const [displayTime, setDisplayTime] = useState(true)
  const [hoursLeft, setHoursLeft] = useState('00')
  const [minutesLeft, setMinutesLeft] = useState('00')
  const [secondsLeft, setSecondsLeft] = useState('00')

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const timeDifference = eventDateEnd.getTime() - now.getTime()

      const hours = Math.floor(timeDifference / (1000 * 60 * 60))
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)

      setHoursLeft(String(hours).padStart(2, '0'))
      setMinutesLeft(String(minutes).padStart(2, '0'))
      setSecondsLeft(String(seconds).padStart(2, '0'))

      if (timeDifference <= 0) {
        setDisplayTime(false)
        timesUp(true)
      }
    }

    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {displayTime ? (
        <div className={visible ? '' : 'hidden'}>
          <p className='font-bold text-3xl text-white mb-2'>time left</p>
          <div className='font-bold text-4xl text-white flex gap-x-3'>
            <span className='flex'>
              <TextTransition springConfig={presets.default}>{hoursLeft}</TextTransition>h
            </span>
            <span className='flex'>
              <TextTransition springConfig={presets.default}>{minutesLeft}</TextTransition>m
            </span>
            <span>{secondsLeft}s</span>
          </div>
        </div>
      ) : (
        <p className='font-bold text-4xl text-white'>
          Fuck
          <br />
          Penn State!
        </p>
      )}
    </>
  )
}

export default TimeLeft
