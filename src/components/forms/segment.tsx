'use client'

import { useConvexMutation } from '@convex-dev/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { api } from '@/convex/_generated/api'
import { segmentPlatforms } from '@/convex/schema/segments'
import type { Segment } from '@/types/db'
import { cn } from '@/utils/style'

const formSchema = z.object({
    title: z.string().min(2).max(50),
    startsAt: z.string(),
    duration: z.string(),
    platform: z.enum(segmentPlatforms).optional(),
})

type FormData = z.infer<typeof formSchema>

interface SegmentFormProps {
    onSaved?: () => void
    segment?: Segment
}

export function SegmentForm(props: SegmentFormProps) {
    const { segment, onSaved } = props

    const createSegment = useConvexMutation(api.segment.create)
    const updateSegment = useConvexMutation(api.segment.update)
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: segment
            ? {
                  title: segment.title,
                  startsAt: segment.startsAt,
                  duration: String(segment.duration),
                  platform: segment.platform,
              }
            : {
                  title: '',
                  startsAt: '',
                  duration: '1',
                  platform: undefined,
              },
    })

    async function onSubmit(values: FormData) {
        const data = {
            title: values.title,
            startsAt: values.startsAt,
            duration: parseInt(values.duration, 10),
            platform: values.platform,
        }
        try {
            if (segment) {
                await updateSegment({ id: segment.id, ...data })
            } else {
                await createSegment(data)
                form.reset()
            }
            onSaved?.()
        } catch (error) {
            console.error('Failed to save segment:', error)
        }
    }

    return (
        <div>
            <Form {...form}>
                <form
                    className={cn(!segment && 'border p-4 rounded')}
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    {!segment && <p className='mb-4'>Add Segment</p>}
                    <div className='space-y-6'>
                        <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Halo: CE'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='startsAt'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Time</FormLabel>
                                    <FormControl>
                                        <Input type='time' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='duration'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Duration</FormLabel>
                                    <Select
                                        defaultValue={field.value}
                                        name={field.name}
                                        onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select a verified email to display' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value='1'>
                                                30 mins
                                            </SelectItem>
                                            <SelectItem value='2'>
                                                1 hr
                                            </SelectItem>
                                            <SelectItem value='3'>
                                                1 hr 30 mins
                                            </SelectItem>
                                            <SelectItem value='4'>
                                                2 hr
                                            </SelectItem>
                                            <SelectItem value='5'>
                                                2 hr 30 mins
                                            </SelectItem>
                                            <SelectItem value='6'>
                                                3 hr
                                            </SelectItem>
                                            <SelectItem value='7'>
                                                3 hr 30 mins
                                            </SelectItem>
                                            <SelectItem value='8'>
                                                4 hr
                                            </SelectItem>
                                            <SelectItem value='9'>
                                                4 hr 30 mins
                                            </SelectItem>
                                            <SelectItem value='10'>
                                                5 hr
                                            </SelectItem>
                                            <SelectItem value='11'>
                                                5 hr 30 mins
                                            </SelectItem>
                                            <SelectItem value='12'>
                                                6 hr
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='platform'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Platform</FormLabel>
                                    <Select
                                        name={field.name}
                                        onValueChange={field.onChange}
                                        value={field.value ?? ''}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select a platform' />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {segmentPlatforms.map(
                                                (platform) => (
                                                    <SelectItem
                                                        key={platform}
                                                        value={platform}
                                                    >
                                                        {platform}
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex justify-end'>
                            <Button type='submit' variant='outline'>
                                Submit
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}
