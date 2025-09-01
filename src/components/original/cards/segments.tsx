'use client';

import { Segment } from '@/types/db';
import { CalendarIcon } from 'lucide-react';

import ContentCard from './card';
import { useSegments } from '@/utils/useSegments';

interface ScheduleProps {
  segments: Segment[];
}

export const Schedule = (props: ScheduleProps) => {
  const { segments } = props;

  const { currentSegment, nextSegment } = useSegments(segments);

  if (!segments || segments.length === 0) {
    return (
      <ContentCard title='Schedule' icon={<CalendarIcon />}>
        <div className='space-y-6'>
          <div>
            <h3>Right Now</h3>
            <p className='text-3xl font-bold text-primary'>No schedule data</p>
          </div>
          <div>
            <h3>Up Next</h3>
            <p className='text-3xl font-bold dark:text-green-600'>No schedule data</p>
          </div>
        </div>
      </ContentCard>
    );
  }

  return (
    <ContentCard title='Schedule' icon={<CalendarIcon />}>
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
    </ContentCard>
  );
};
