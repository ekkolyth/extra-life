'use client'

import type { Rotator } from '@prisma/client'

import * as z from 'zod'
import { TrashIcon } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { updateRotators } from '@/actions/rotators'
import { useTransition } from 'react'

export const formSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().optional(),
      text: z.string()
    })
  )
})

interface RotatorFormProps {
  items?: Rotator[]
}

export function RotatorForm(props: RotatorFormProps) {
  const { items } = props

  const [, startTransition] = useTransition()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { items } ?? { items: [] }
  })
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items'
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    startTransition(() => {
      updateRotators(values)
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        {fields.map((field, index) => (
          <FormField
            key={field.id}
            control={form.control}
            name={`items.${index}.text`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item {index + 1}</FormLabel>
                <FormControl>
                  <div className='flex gap-2'>
                    <Input placeholder='shadcn' {...field} />
                    <Button variant='destructive' size='icon' onClick={() => remove(index)}>
                      <TrashIcon />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button
          variant='link'
          type='button'
          onClick={() =>
            append({
              text: ''
            })
          }>
          Add Item
        </Button>
        <div className='flex justify-end'>
          <Button type='submit'>Save</Button>
        </div>
      </form>
    </Form>
  )
}
