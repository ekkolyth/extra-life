import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { Segment } from '@/types/db';
import { useSegments } from '@/utils/useSegments';

interface ScheduleSectionProps {
  segments: Segment[];
}

export function ScheduleSection({ segments }: ScheduleSectionProps) {
  const { currentSegment, nextSegment } = useSegments(segments);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Calendar className='h-5 w-5 text-primary' />
          Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <div className='flex items-center gap-2 text-sm'>
            <Clock className='h-4 w-4 text-muted-foreground' />
            <span className='font-medium'>Right Now</span>
          </div>
          <p className='text-muted-foreground pl-6'>
            {currentSegment?.title || 'n/a'}
          </p>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center gap-2 text-sm'>
            <Clock className='h-4 w-4 text-muted-foreground' />
            <span className='font-medium'>Up Next</span>
          </div>
          <p className='text-accent font-medium pl-6'>
            {nextSegment?.title || 'n/a'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
