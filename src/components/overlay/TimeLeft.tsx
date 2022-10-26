// Display the current countdown to November 13 at 10am in hours, minutes, and seconds
// Bonus fun when we reach zero

import { useEffect, useState } from 'react'
import TextTransition, { presets } from 'react-text-transition'

const TimeLeft = ({ timesUp }: { timesUp: (value: boolean) => void }) => {
  const [displayTime, setDisplayTime] = useState(true)
  const [timeLeft, setTimeLeft] = useState('00h 00m 00s')
  const [hoursLeft, setHoursLeft] = useState('00')
  const [minutesLeft, setMinutesLeft] = useState('00')
  const [secondsLeft, setSecondsLeft] = useState('00')

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const eventDate = new Date('November 13, 2022 10:00:00')
      const currentTime = now.getTime()
      const eventTime = eventDate.getTime()
      const remTime = eventTime - currentTime

      const s = Math.floor(remTime / 1000)
      const m = Math.floor(s / 60)
      const h = Math.floor(m / 60)

      const hDisplay = h % 24
      const mDisplay = m % 60
      const sDisplay = s % 60

      if (hDisplay <= 0 && mDisplay <= 0 && sDisplay <= 0) {
        setDisplayTime(false)
        timesUp(true)
      } else {
        setDisplayTime(true)
        timesUp(false)
      }

      setHoursLeft(hDisplay.toString())
      setMinutesLeft(mDisplay.toString())
      setSecondsLeft(sDisplay.toString())
      setTimeLeft(`${hDisplay}h ${mDisplay}m ${sDisplay}s`)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className='bg-purple-bar-1 w-72 rounded-xl py-4 px-6 shadow-super'>
      {displayTime ? (
        <>
          <p className='font-bold text-3xl text-white mb-2'>time left:</p>
          <div className='font-bold text-4xl text-white flex gap-x-3'>
            <span className='flex'>
              <TextTransition springConfig={presets.default}>{hoursLeft}</TextTransition>h
            </span>
            <span className='flex'>
              <TextTransition springConfig={presets.default}>{minutesLeft}</TextTransition>m
            </span>
            <span>{secondsLeft}s</span>
          </div>
        </>
      ) : (
        <p className='font-bold text-4xl text-white'>
          Fuck
          <br />
          Penn State!
        </p>
      )}
    </div>
  )
}

export default TimeLeft
