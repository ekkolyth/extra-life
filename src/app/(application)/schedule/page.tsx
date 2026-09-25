'use client'

import { SegmentForm } from '@/components/forms/segment'
import { Calendar } from './calendar'

export default function SchedulePage() {
    return (
        <div className='grid grid-cols-2 gap-8'>
            <SegmentForm />
            <Calendar />
        </div>
    )
}
