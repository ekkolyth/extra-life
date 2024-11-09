import type { Segment } from '@prisma/client'

import { set } from 'date-fns'
import { useEffect, useState } from 'react'

export function useSegments(segments: Segment[]) {
  const [currentSegment, setCurrentSegment] = useState<Segment | null>(null)
  const [nextSegment, setNextSegment] = useState<Segment | null>(null)

  useEffect(() => {
    const updateSegments = () => {
      const now = new Date()
      let current: Segment | null = null
      let next: Segment | null = null

      for (let i = 0; i < segments.length; i++) {
        const event = segments[i]
        const [hours, minutes] = event.startsAt.split(':').map(Number)
        const eventStart = new Date(now)
        eventStart.setHours(hours, minutes, 0, 0)

        const eventEnd = new Date(eventStart)
        eventEnd.setMinutes(eventEnd.getMinutes() + event.duration * 30)

        if (now >= eventStart && now < eventEnd) {
          current = event
          next = segments[i + 1] || null
          break
        } else if (now < eventStart) {
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
