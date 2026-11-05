import { Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Segment } from '@/types/db'
import { useSegments } from '@/utils/use-segments'

interface ScheduleSectionProps {
    segments: Segment[]
}

export function ScheduleSection({ segments }: ScheduleSectionProps) {
    const { currentSegment, nextSegment } = useSegments(segments)

    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <div className='flex size-8 shrink-0 items-center justify-center rounded-sm border'>
                        <Calendar className='size-4 text-primary' />
                    </div>
                    Schedule
                </CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col divide-y'>
                <div className='flex flex-col gap-1 pb-4'>
                    <p className='text-base sm:text-sm text-muted-foreground'>
                        Right Now
                    </p>
                    <p className='truncate text-lg font-medium text-foreground'>
                        {currentSegment?.title || 'n/a'}
                    </p>
                </div>
                <div className='flex flex-col gap-1 pt-4'>
                    <p className='text-base sm:text-sm text-muted-foreground'>
                        Up Next
                    </p>
                    <p className='truncate text-lg font-medium text-primary'>
                        {nextSegment?.title || 'n/a'}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
