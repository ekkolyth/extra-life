// Use dayjs to display the current countdown to November 13 at 10am in hours, minutes, and seconds

import { useEffect, useState } from 'react'

const TimeLeft = () => {
  const [timeLeft, setTimeLeft] = useState('00h 00m 00s')

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

      setTimeLeft(`${hDisplay}h ${mDisplay}m ${sDisplay}s`)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className='bg-purple-bar-1 w-72 rounded-xl py-4 px-6 shadow-super'>
      <p className='font-bold text-3xl text-white mb-2'>time left:</p>
      <p className='font-bold text-4xl text-white truncate'>{timeLeft}</p>
    </div>
  )
}

export default TimeLeft
