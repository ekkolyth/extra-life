'use client'

import { useConvexMutation } from '@convex-dev/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { TrashIcon } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
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
import { api } from '@/convex/_generated/api'

export const formSchema = z.object({
    name: z.string().trim().min(1),
    items: z.array(z.object({ name: z.string().trim().min(1) })),
})

interface RandomizerFormProps {
    onCreated?: () => void
}

export function RandomizerForm(props: RandomizerFormProps) {
    const { onCreated } = props

    const createRandomizer = useConvexMutation(api.randomizer.create)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: '', items: [] },
    })
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'items',
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createRandomizer({
                name: values.name,
                items: { create: values.items },
            })
            form.reset()
            onCreated?.()
        } catch (error) {
            console.error('Failed to save randomizer:', error)
        }
    }

    return (
        <Form {...form}>
            <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    autoComplete='off'
                                    placeholder='Demo'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <fieldset>
                    <legend className='font-semibold pb-2'>Items</legend>
                    {fields.length > 0 &&
                        fields.map((field, index) => (
                            <div
                                className='flex gap-4 items-end'
                                key={field.id}
                            >
                                <FormField
                                    control={form.control}
                                    name={`items.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem className='flex-grow'>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    autoComplete='off'
                                                    placeholder='Demo Item'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    onClick={() => remove(index)}
                                    size='icon'
                                    type='button'
                                    variant='outline'
                                >
                                    <span className='sr-only'>Remove</span>
                                    <TrashIcon />
                                </Button>
                            </div>
                        ))}
                    <Button
                        className='mt-4'
                        onClick={() => append({ name: '' })}
                        type='button'
                        variant='outline'
                    >
                        Add Item
                    </Button>
                </fieldset>
                <div className='flex justify-end'>
                    <Button type='submit' variant='outline'>
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    )
}
