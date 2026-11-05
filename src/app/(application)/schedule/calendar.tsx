'use client'

import { useConvexMutation, useConvexQuery } from '@convex-dev/react-query'
import { PencilIcon, TrashIcon } from 'lucide-react'
import { Fragment, useState } from 'react'
import { SegmentForm } from '@/components/forms/segment'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { api } from '@/convex/_generated/api'
import type { SegmentPlatform } from '@/convex/schema/segments'
import type { Segment } from '@/types/db'
import { cn } from '@/utils/style'
import { timeslotFromIndex, timeslotIndexFromStart } from '@/utils/time'

const platformBackgrounds: Record<SegmentPlatform, string> = {
    'Podcast Set': 'bg-purple-200 dark:bg-purple-600',
    Xbox: 'bg-emerald-200 dark:bg-emerald-600',
    Switch: 'bg-red-200 dark:bg-red-600',
    PS4: 'bg-blue-300 dark:bg-blue-900',
    PC: 'bg-pink-200 dark:bg-pink-600',
}

function EditSegmentDialog({ segment }: { segment: Segment }) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger asChild>
                <Button size='sm' variant='ghost'>
                    <span className='sr-only'>Edit</span>
                    <PencilIcon className='h-4 w-4' />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Segment</DialogTitle>
                </DialogHeader>
                <SegmentForm onSaved={() => setOpen(false)} segment={segment} />
            </DialogContent>
        </Dialog>
    )
}

export function Calendar() {
    const segments = useConvexQuery(api.segment.list, {}) || []
    const deleteSegment = useConvexMutation(api.segment.removeSegment)

    return (
        <div className='isolate flex flex-auto overflow-hidden'>
            <div className='flex flex-auto flex-col overflow-auto'>
                <div className='flex w-full flex-auto'>
                    <div className='w-14 flex-none ring-1 ring-foreground/30' />
                    <div className='grid flex-auto grid-cols-1 grid-rows-1 pt-2'>
                        {/* Horizontal lines */}
                        <div
                            className='col-start-1 col-end-2 row-start-1 grid divide-y divide-foreground/30'
                            style={{
                                gridTemplateRows:
                                    'repeat(48, minmax(2.5rem, 1fr))',
                            }}
                        >
                            {Array.from({ length: 24 }).map((_, i) => (
                                <Fragment key={timeslotFromIndex(i)}>
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
                            style={{
                                gridTemplateRows:
                                    'repeat(48, minmax(2.5rem, 1fr))',
                            }}
                        >
                            {segments.map((segment) => (
                                <li
                                    className={cn(
                                        'p-2 m-2 rounded flex justify-between',
                                        segment.platform
                                            ? platformBackgrounds[
                                                  segment.platform
                                              ]
                                            : 'bg-primary text-primary-foreground'
                                    )}
                                    key={segment._id}
                                    style={{
                                        gridRow: `${timeslotIndexFromStart(segment.startsAt)} / span ${
                                            segment.duration
                                        }`,
                                    }}
                                >
                                    <div>
                                        <p>{segment.title}</p>
                                        {segment.platform && (
                                            <p className='text-sm opacity-80'>
                                                {segment.platform}
                                            </p>
                                        )}
                                    </div>
                                    <div className='flex items-start'>
                                        <EditSegmentDialog
                                            segment={{
                                                id: segment._id,
                                                title: segment.title,
                                                startsAt: segment.startsAt,
                                                duration: segment.duration,
                                                platform: segment.platform,
                                            }}
                                        />
                                        <Button
                                            onClick={() =>
                                                deleteSegment({
                                                    id: segment._id,
                                                })
                                            }
                                            size='sm'
                                            variant='ghost'
                                        >
                                            <span className='sr-only'>
                                                Delete
                                            </span>
                                            <TrashIcon className='h-4 w-4' />
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    )
}
