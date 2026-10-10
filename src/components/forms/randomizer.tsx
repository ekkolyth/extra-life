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
import type { Randomizer } from '@/types/db'

export const formSchema = z.object({
    name: z.string().trim().min(1),
    items: z.array(z.object({ name: z.string().trim().min(1) })),
})

interface RandomizerFormProps {
    randomizer?: Randomizer
}

export function RandomizerForm(props: RandomizerFormProps) {
    const { randomizer } = props

    const createRandomizer = useConvexMutation(api.randomizer.create)
    const updateRandomizer = useConvexMutation(api.randomizer.update)
    const deleteRandomizer = useConvexMutation(api.randomizer.delete)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: randomizer?.name ?? '',
            items: randomizer?.items.map((item) => ({ name: item.name })) ?? [],
        },
    })
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'items',
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (randomizer) {
                // Update existing randomizer
                await updateRandomizer({
                    id: randomizer.id,
                    name: values.name,
                    items: { create: values.items },
                })
            } else {
                // Create new randomizer
                await createRandomizer({
                    name: values.name,
                    items: { create: values.items },
                })
            }
        } catch (error) {
            console.error('Failed to save randomizer:', error)
        }
    }

    async function handleDelete() {
        if (!randomizer) return

        try {
            await deleteRandomizer({ id: randomizer.id })
        } catch (error) {
            console.error('Failed to delete randomizer:', error)
        }
    }

    return (
        <div className='border rounded p-4'>
            <header className='flex items-start justify-between'>
                <h3 className='text-lg font-semibold pb-4'>
                    {randomizer ? 'Edit Randomizer' : 'New Randomizer'}
                </h3>
                {randomizer && (
                    <Button
                        onClick={handleDelete}
                        size='sm'
                        type='button'
                        variant='outline'
                    >
                        Delete {randomizer.name}
                    </Button>
                )}
            </header>
            <Form {...form}>
                <form
                    className='space-y-8'
                    onSubmit={form.handleSubmit(onSubmit)}
                >
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
        </div>
    )
}
