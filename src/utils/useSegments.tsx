import type { Segment } from '@/types/db'

import { useEffect, useState, useRef } from 'react'

export function useSegments(segments: Segment[]) {
  const [currentSegment, setCurrentSegment] = useState<Segment | null>(null)
  const [nextSegment, setNextSegment] = useState<Segment | null>(null)
  const segmentsRef = useRef(segments)

  // Update ref when segments change
  useEffect(() => {
    segmentsRef.current = segments
  }, [segments])

  useEffect(() => {
    // Don't set up interval if segments haven't loaded yet
    if (!segments || segments.length === 0) {
      setCurrentSegment(null)
      setNextSegment(null)
      return
    }

    const updateSegments = () => {
      console.log('updateSegments')
      const now = new Date()
      let current: Segment | null = null
      let next: Segment | null = null

      console.log('Current time:', now.toISOString())
      console.log('Stream date env var:', process.env.NEXT_PUBLIC_STREAM_DATETIME)
      console.log('Segments:', segmentsRef.current)

      // Sort segments by start time to ensure chronological order
      const sortedSegments = [...segmentsRef.current].sort((a, b) => {
        const [aHours, aMinutes] = a.startsAt.split(':').map(Number)
        const [bHours, bMinutes] = b.startsAt.split(':').map(Number)
        if (aHours !== bHours) return aHours - bHours
        return aMinutes - bMinutes
      })

      // Use the stream date from environment variable, or fall back to today
      const streamDate = process.env.NEXT_PUBLIC_STREAM_DATETIME 
        ? new Date(process.env.NEXT_PUBLIC_STREAM_DATETIME)
        : new Date()

      for (let i = 0; i < sortedSegments.length; i++) {
        const event = sortedSegments[i]
        const [hours, minutes] = event.startsAt.split(':').map(Number)
        
        const eventStart = new Date(streamDate)
        eventStart.setHours(hours, minutes, 0, 0)

        const eventEnd = new Date(eventStart)
        eventEnd.setMinutes(eventEnd.getMinutes() + event.duration * 30)

        console.log(`Event: ${event.title}, Start: ${eventStart.toISOString()}, End: ${eventEnd.toISOString()}`)

        if (now >= eventStart && now < eventEnd) {
          console.log('Current:', event)
          current = event
          // Find the next segment that hasn't started yet
          for (let j = i + 1; j < sortedSegments.length; j++) {
            const nextEvent = sortedSegments[j]
            const [nextHours, nextMinutes] = nextEvent.startsAt.split(':').map(Number)
            const nextEventStart = new Date(streamDate)
            nextEventStart.setHours(nextHours, nextMinutes, 0, 0)
            
            if (now < nextEventStart) {
              next = nextEvent
              break
            }
          }
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

    // Update immediately when segments change
    updateSegments()
    // Set up interval to update every minute
    const interval = setInterval(updateSegments, 60000)

    return () => clearInterval(interval)
  }, [segments]) // Re-run when segments change

  return { currentSegment, nextSegment }
}
