'use client'

import { useConvexMutation } from '@convex-dev/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { TrashIcon } from 'lucide-react'
import { useFieldArray, useForm, useFormContext } from 'react-hook-form'
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

const itemsSchema = z.array(z.object({ name: z.string().trim().min(1) }))

export const formSchema = z.object({
    name: z.string().trim().min(1),
    items: itemsSchema,
    firstListName: z.string().trim().min(1),
    secondListName: z.string().trim().min(1),
    secondItems: itemsSchema,
})

interface ItemFieldsProps {
    name: 'items' | 'secondItems'
}

function ItemFields(props: ItemFieldsProps) {
    const { name } = props

    const { control } = useFormContext<z.infer<typeof formSchema>>()
    const { fields, append, remove } = useFieldArray({ control, name })

    return (
        <>
            {fields.length > 0 &&
                fields.map((field, index) => (
                    <div className='flex gap-4 items-end' key={field.id}>
                        <FormField
                            control={control}
                            name={`${name}.${index}.name`}
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
        </>
    )
}

interface RandomizerFormProps {
    dual?: boolean
    onCreated?: () => void
}

export function RandomizerForm(props: RandomizerFormProps) {
    const { dual, onCreated } = props

    const createRandomizer = useConvexMutation(api.randomizer.create)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            items: [],
            firstListName: 'List 1',
            secondListName: 'List 2',
            secondItems: [],
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createRandomizer({
                name: values.name,
                items: { create: values.items },
                ...(dual && {
                    secondItems: { create: values.secondItems },
                    firstListName: values.firstListName,
                    secondListName: values.secondListName,
                }),
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
                {dual ? (
                    <div className='grid items-start gap-8 sm:grid-cols-2'>
                        <fieldset aria-label={form.watch('firstListName')}>
                            <FormField
                                control={form.control}
                                name='firstListName'
                                render={({ field }) => (
                                    <FormItem className='pb-2'>
                                        <FormLabel>List name</FormLabel>
                                        <FormControl>
                                            <Input
                                                autoComplete='off'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <ItemFields name='items' />
                        </fieldset>
                        <fieldset aria-label={form.watch('secondListName')}>
                            <FormField
                                control={form.control}
                                name='secondListName'
                                render={({ field }) => (
                                    <FormItem className='pb-2'>
                                        <FormLabel>List name</FormLabel>
                                        <FormControl>
                                            <Input
                                                autoComplete='off'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <ItemFields name='secondItems' />
                        </fieldset>
                    </div>
                ) : (
                    <fieldset>
                        <legend className='font-semibold pb-2'>Items</legend>
                        <ItemFields name='items' />
                    </fieldset>
                )}
                <div className='flex justify-end'>
                    <Button type='submit' variant='outline'>
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    )
}
