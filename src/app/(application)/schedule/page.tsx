'use client';

import { Calendar } from './calendar';
import { SegmentForm } from '@/components/original/forms/segment';

export default function SchedulePage() {
  return (
    <div className='grid grid-cols-2 gap-8'>
      <SegmentForm />
      <Calendar />
    </div>
  );
}
