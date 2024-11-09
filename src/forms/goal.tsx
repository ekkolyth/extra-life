'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { DollarSignIcon } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormState } from 'react-dom'

import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { createGoal, updateGoal } from '@/actions/goals'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { DialogClose } from '@/components/ui/dialog'
import { useActionState } from 'react'

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2).max(50),
  amount: z.number().min(1).max(1000000),
  endOfStream: z.boolean()
})

const initialState = {
  message: null
}

interface GoalFormProps {
  defaultValues?: z.infer<typeof formSchema>
}

export function GoalForm(props: GoalFormProps) {
  const { defaultValues } = props
  const [state, formAction] = useActionState(defaultValues ? updateGoal : createGoal, initialState as any)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {
      title: '',
      amount: 0,
      endOfStream: false
    }
  })

  return (
    <Form {...form}>
      <form action={formAction} className='space-y-8'>
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
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder='Eat Shit' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='amount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <div className='flex items-center gap-2'>
                <DollarSignIcon />
                <FormControl>
                  <Input type='number' step={0.01} {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='endOfStream'
          render={({ field: { value, onChange, name } }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
              <div className='space-y-0.5'>
                <FormLabel className='text-base'>End of Stream</FormLabel>
              </div>
              <FormControl>
                <Switch checked={value} onCheckedChange={onChange} name={name} />
              </FormControl>
            </FormItem>
          )}
        />
        <DialogClose asChild>
          <Button type='submit'>Submit</Button>
        </DialogClose>
      </form>
    </Form>
  )
}
