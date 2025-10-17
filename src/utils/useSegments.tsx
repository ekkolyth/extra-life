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
    const updateSegments = () => {
      console.log('updateSegments')
      const now = new Date()
      let current: Segment | null = null
      let next: Segment | null = null

      console.log('Current time:', now.toISOString())
      console.log('Stream date env var:', process.env.NEXT_PUBLIC_STREAM_DATETIME)
      console.log('Segments:', segmentsRef.current)

      for (let i = 0; i < segmentsRef.current.length; i++) {
        const event = segmentsRef.current[i]
        const [hours, minutes] = event.startsAt.split(':').map(Number)
        
        // Use the stream date from environment variable, or fall back to today
        const streamDate = process.env.NEXT_PUBLIC_STREAM_DATETIME 
          ? new Date(process.env.NEXT_PUBLIC_STREAM_DATETIME)
          : new Date()
        
        const eventStart = new Date(streamDate)
        eventStart.setHours(hours, minutes, 0, 0)

        const eventEnd = new Date(eventStart)
        eventEnd.setMinutes(eventEnd.getMinutes() + event.duration * 30)

        console.log(`Event: ${event.title}, Start: ${eventStart.toISOString()}, End: ${eventEnd.toISOString()}`)

        if (now >= eventStart && now < eventEnd) {
          console.log('Current:', event)
          current = event
          next = segmentsRef.current[i + 1] || null
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
  }, []) // Empty dependency array - only run once

  return { currentSegment, nextSegment }
}
