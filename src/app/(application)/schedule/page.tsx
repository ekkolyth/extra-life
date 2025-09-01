'use client';

import { Calendar } from './calendar';
import { SegmentForm } from '@/components/original/forms/segment';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function SchedulePage() {
  const convexSegments = useQuery(api.segment.list) || [];

  // Transform Convex data to match expected component types
  const segments = convexSegments.map((s) => ({
    id: s._id,
    title: s.title,
    startsAt: s.startsAt,
    duration: s.duration,
  }));

  return (
    <div className='grid grid-cols-2 gap-8'>
      <SegmentForm />
      <Calendar segments={segments} />
    </div>
  );
}
