import { getSegments } from '@/actions/segments'
import { Calendar } from './calendar'
import { SegmentForm } from '@/forms/segment'

export default async function SchedulePage() {
  const segmentData = getSegments()

  const [segments] = await Promise.all([segmentData])

  return (
    <div className='grid grid-cols-2 gap-8'>
      <SegmentForm />
      <Calendar segments={segments} />
    </div>
  )
}
