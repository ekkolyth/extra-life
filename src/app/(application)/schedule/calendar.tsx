'use client';

import { Fragment } from 'react';
import { TrashIcon } from 'lucide-react';
import { useConvexQuery, useConvexMutation } from '@convex-dev/react-query';
import { api } from '@/convex/_generated/api';
import { set, subMinutes } from 'date-fns';

import { cn } from '@/utils/style';
import { Button } from '@/components/ui/button';
import { timeslotFromIndex, timeslotIndexFromStart } from '@/utils/time';

export function Calendar() {
  const segments = useConvexQuery(api.segment.list, {}) || [];
  const deleteSegment = useConvexMutation(api.segment.removeSegment);

  function getBackground(id: string) {
    let background = 'bg-secondary';
    const segment = segments.find((s) => s._id === id);
    const startHour = Number(segment?.startsAt.split(':')[0] ?? '');
    const startMinutes = Number(segment?.startsAt.split(':')[1] ?? '');
    const endHour = startHour + Number(segment?.duration) / 2;
    const endMinutes = startMinutes + (Number(segment?.duration) % 2) * 30;

    const now = new Date();
    let start = new Date();
    let end = new Date();
    start = set(start, {
      hours: startHour,
      minutes: startMinutes,
      seconds: 0,
    });
    end = set(end, {
      hours: endHour,
      minutes: endMinutes,
      seconds: 0,
    });

    // If the end is before now, make it grey
    if (now > end) background = 'bg-secondary';
    // If the start is before now and the end is after now, make it green
    else if (now > start && now < end) background = 'dark:bg-green-600';
    // If the start is within 30 minutes of now, make it yellow
    else if (now >= subMinutes(start, 30)) background = 'dark:bg-yellow-600';

    return background;
  }

  return (
    <div className='isolate flex flex-auto overflow-hidden'>
      <div className='flex flex-auto flex-col overflow-auto'>
        <div className='flex w-full flex-auto'>
          <div className='w-14 flex-none ring-1 ring-foreground/30' />
          <div className='grid flex-auto grid-cols-1 grid-rows-1 pt-2'>
            {/* Horizontal lines */}
            <div
              className='col-start-1 col-end-2 row-start-1 grid divide-y divide-foreground/30'
              style={{ gridTemplateRows: 'repeat(48, minmax(2.5rem, 1fr))' }}
            >
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
              style={{ gridTemplateRows: 'repeat(48, minmax(2.5rem, 1fr))' }}
            >
              {segments.map((segment) => (
                <li
                  key={segment._id}
                  className={cn('p-2 m-2 rounded flex justify-between', getBackground(segment._id))}
                  style={{
                    gridRow: `${timeslotIndexFromStart(segment.startsAt)} / span ${
                      segment.duration
                    }`,
                  }}
                >
                  <p>{segment.title}</p>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => deleteSegment({ id: segment._id })}
                  >
                    <span className='sr-only'>Delete</span>
                    <TrashIcon className='h-4 w-4' />
                  </Button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
