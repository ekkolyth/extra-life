import type { Segment } from '@/types/db'

import { useEffect, useState } from 'react'

export function useSegments(segments: Segment[]) {
  const [currentSegment, setCurrentSegment] = useState<Segment | null>(null)
  const [nextSegment, setNextSegment] = useState<Segment | null>(null)

  useEffect(() => {
    const updateSegments = () => {
      console.log('updateSegments')
      const now = new Date()
      let current: Segment | null = null
      let next: Segment | null = null

      console.log('Segments:', segments)

      for (let i = 0; i < segments.length; i++) {
        const event = segments[i]
        const [hours, minutes] = event.startsAt.split(':').map(Number)
        const eventStart = new Date(String(process.env.NEXT_PUBLIC_STREAM_DATETIME))
        eventStart.setHours(hours, minutes, 0, 0)

        const eventEnd = new Date(eventStart)
        eventEnd.setMinutes(eventEnd.getMinutes() + event.duration * 30)

        if (now >= eventStart && now < eventEnd) {
          console.log('Current:', event)
          current = event
          next = segments[i + 1] || null
          break
        } else if (now < eventStart) {
          console.log('Next:', event)
          next = event
          break
        }
      }

      setCurrentSegment(current)
      setNextSegment(next)
    }

    updateSegments()
    const interval = setInterval(updateSegments, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [segments])

  return { currentSegment, nextSegment }
}
