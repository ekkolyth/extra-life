'use client'

import type { Randomizer } from '@/types/db'

import * as z from 'zod'
import { TrashIcon } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useTransition } from 'react'
import { createRandomizer, deleteRandomizer, updateRandomizer } from '@/actions/randomizer'

export const formSchema = z.object({
  name: z.string().min(2),
  items: z.array(
    z.object({
      name: z.string(),
      limit: z.coerce.number().int().positive(),
      redeemed: z.coerce.number().int().optional()
    })
  )
})

interface RandomizerFormProps {
  randomizer?: Randomizer
}

export function RandomizerForm(props: RandomizerFormProps) {
  const { randomizer } = props

  const updateRandomizerWithId = randomizer ? updateRandomizer.bind(null, randomizer.id) : undefined
  const deleteRandomizerWithId = randomizer ? deleteRandomizer.bind(null, randomizer.id) : undefined

  const [, startTransition] = useTransition()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: randomizer ?? {
      name: '',
      items: []
    }
  })
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items'
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => {
      if (randomizer && updateRandomizerWithId) {
        updateRandomizerWithId(values)
      } else {
        createRandomizer(values)
      }
    })
  }

  return (
    <div className='border rounded p-4'>
      <header className='flex items-start justify-between'>
        <h3 className='text-lg font-semibold pb-4'>{randomizer ? 'Edit Randomizer' : 'New Randomizer'}</h3>
        {randomizer && (
          <form action={deleteRandomizerWithId}>
            <Button type='submit' size='sm' variant='outline'>
              Delete {randomizer.name}
            </Button>
          </form>
        )}
      </header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input autoComplete='off' placeholder='Demo' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <fieldset>
            <legend className='font-semibold pb-2'>Items</legend>
            {fields.length > 0 &&
              fields.map((field, index) => (
                <div key={field.id} className='flex gap-4 items-end'>
                  <FormField
                    control={form.control}
                    name={`items.${index}.name`}
                    render={({ field }) => (
                      <FormItem className='flex-grow'>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input autoComplete='off' placeholder='Demo Item' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.limit`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Limit</FormLabel>
                        <FormControl>
                          <Input type='number' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.redeemed`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Redeemed</FormLabel>
                        <FormControl>
                          <Input type='number' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type='button' size='icon' variant='destructive' onClick={() => remove(index)}>
                    <span className='sr-only'>Remove</span>
                    <TrashIcon />
                  </Button>
                </div>
              ))}
            <Button
              type='button'
              variant='secondary'
              onClick={() => append({ name: '', limit: 1, redeemed: 0 })}
              className='mt-4'>
              Add Item
            </Button>
          </fieldset>
          <div className='flex justify-end'>
            <Button type='submit'>Save</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
