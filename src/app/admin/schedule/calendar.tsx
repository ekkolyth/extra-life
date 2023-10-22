'use client'

import { Fragment } from 'react'
import { Segment } from '@prisma/client'

import { timeslotFromIndex, timeslotIndexFromStart } from '@/utils/time'
import { deleteSegment } from '@/actions/segments'
import { Button } from '@/components/ui/button'
import { TrashIcon } from 'lucide-react'
import { useQuery } from 'react-query'
import { queryClient } from '@/app/providers'

interface CalendarProps {
  segments: Segment[]
}

export function Calendar(props: CalendarProps) {
  const { data: segments } = useQuery(
    'segments',
    () => fetch('/api/segments').then(res => res.json() as Promise<Segment[]>),
    {
      initialData: props.segments
    }
  )

  return (
    <div className='isolate flex flex-auto overflow-hidden'>
      <div className='flex flex-auto flex-col overflow-auto'>
        <div className='flex w-full flex-auto'>
          <div className='w-14 flex-none ring-1 ring-foreground/30' />
          <div className='grid flex-auto grid-cols-1 grid-rows-1 pt-2'>
            {/* Horizontal lines */}
            <div
              className='col-start-1 col-end-2 row-start-1 grid divide-y divide-foreground/30'
              style={{ gridTemplateRows: 'repeat(48, minmax(2.5rem, 1fr))' }}>
              {Array.from({ length: 24 }).map((_, i) => (
                <Fragment key={i}>
                  <div>
                    <div className='sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5'>
                      {timeslotFromIndex(i)}
                    </div>
                  </div>
                  {i !== 23 ? (
                    <div />
                  ) : (
                    <div>
                      <div className='sticky left-0 -ml-14 mt-10 w-14 pr-2 text-right text-xs leading-5'>
                        {timeslotFromIndex(i + 1)}
                      </div>
                    </div>
                  )}
                </Fragment>
              ))}
            </div>

            {/* Events */}
            <ol
              className='col-start-1 col-end-2 row-start-1 grid grid-cols-1'
              style={{ gridTemplateRows: 'repeat(48, minmax(2.5rem, 1fr))' }}>
              {segments?.map(segment => (
                <li
                  key={segment.id}
                  className='bg-secondary p-2 m-2 rounded flex justify-between'
                  style={{ gridRow: `${timeslotIndexFromStart(segment.startsAt)} / span ${segment.duration}` }}>
                  <p>{segment.title}</p>
                  <form
                    onSubmit={e =>
                      fetch('/api/segments', {
                        method: 'DELETE',
                        body: JSON.stringify({ id: segment.id })
                      }).then(() => queryClient.invalidateQueries('segments'))
                    }>
                    <input type='hidden' value={segment.id} name='id' />
                    <Button variant='ghost' size='sm'>
                      <span className='sr-only'>Delete</span>
                      <TrashIcon className='h-4 w-4' />
                    </Button>
                  </form>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
