import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { Segment } from '@/types/db';
import { useSegments } from '@/utils/useSegments';

interface ScheduleSectionProps {
  segments: Segment[];
}

export function ScheduleSection({ segments }: ScheduleSectionProps) {
  const { currentSegment, nextSegment } = useSegments(segments);

  return (
    <Card className='border-border/50 bg-card/50 backdrop-blur-sm'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Calendar className='h-5 w-5 text-primary' />
          Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6 py-6'>
        <div className='space-y-3'>
          <div className='flex items-center gap-3'>
            <Clock className='h-5 w-5 text-muted-foreground' />
            <span className='text-base font-semibold text-foreground'>Right Now</span>
          </div>
          <p className='text-2xl font-medium text-foreground pl-8'>
            {currentSegment?.title || 'n/a'}
          </p>
        </div>

        <div className='space-y-3 pt-2'>
          <div className='flex items-center gap-3'>
            <Clock className='h-5 w-5 text-muted-foreground' />
            <span className='text-base font-semibold text-foreground'>Up Next</span>
          </div>
          <p className='text-2xl font-semibold text-primary pl-8'>
            {nextSegment?.title || 'n/a'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
