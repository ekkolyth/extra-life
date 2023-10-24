'use client'

import { Segment } from '@prisma/client'
import Card from './card'
import { CalendarIcon } from 'lucide-react'
import { set } from 'date-fns'

interface ScheduleProps {
  segments: Segment[]
}

export const Schedule = (props: ScheduleProps) => {
  const { segments } = props

  console.log(segments)
  const now = new Date()
  const currentSegment = segments.find(segment => {
    const start = set(now, {
      hours: Number(segment.startsAt.split(':')[0]),
      minutes: Number(segment.startsAt.split(':')[1]),
      seconds: 0
    })
    const end = set(now, {
      hours: Number(segment.startsAt.split(':')[0]) + Number(segment.duration) / 2,
      minutes: Number(segment.startsAt.split(':')[1]) + (Number(segment.duration) % 2) * 30,
      seconds: 0
    })

    if (now > start && now < end) return true
  })
  const nextSegment = segments.find(segment => {
    const start = set(now, {
      hours: Number(segment.startsAt.split(':')[0]),
      minutes: Number(segment.startsAt.split(':')[1]),
      seconds: 0
    })

    if (now < start) return true
  })

  return (
    <Card title='Schedule' icon={<CalendarIcon />}>
      <div className='space-y-6'>
        <div>
          <h3>Right Now</h3>
          <p className='text-3xl font-bold text-primary'>{currentSegment?.title ?? 'n/a'}</p>
        </div>
        <div>
          <h3>Up Next</h3>
          <p className='text-3xl font-bold dark:text-green-600'>{nextSegment?.title ?? 'n/a'}</p>
        </div>
      </div>
    </Card>
  )
}
