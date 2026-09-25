'use client'

import { useConvexMutation } from '@convex-dev/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'

const formSchema = z.object({
    id: z.string().optional(),
    text: z.string().min(1, 'Text is required'),
})

type FormData = z.infer<typeof formSchema>

interface RotatorFormProps {
    defaultValues?: FormData
}

export function RotatorForm(props: RotatorFormProps) {
    const { defaultValues } = props

    const createRotator = useConvexMutation(api.rotator.create)
    const updateRotator = useConvexMutation(api.rotator.update)

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues ?? {
            text: '',
        },
    })

    async function onSubmit(values: FormData) {
        try {
            if (values.id) {
                // Update existing rotator
                await updateRotator({
                    id: values.id as Id<'rotator'>,
                    text: values.text,
                })
            } else {
                // Create new rotator
                await createRotator({ text: values.text })
                // Reset form after successful creation
                form.reset()
            }
        } catch (error) {
            console.error('Failed to save rotator:', error)
        }
    }

    return (
        <Form {...form}>
            <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
                {defaultValues?.id && (
                    <FormField
                        control={form.control}
                        name='id'
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input type='hidden' {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                )}
                <FormField
                    control={form.control}
                    name='text'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-base font-semibold'>
                                Text
                            </FormLabel>
                            <FormControl>
                                <Input
                                    className='text-base'
                                    placeholder='Enter rotator text...'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogClose asChild>
                    <Button
                        className='text-base'
                        size='lg'
                        type='submit'
                        variant='outline'
                    >
                        Submit
                    </Button>
                </DialogClose>
            </form>
        </Form>
    )
}
