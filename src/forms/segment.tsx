'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
// @ts-ignore
import { experimental_useFormState as useFormState } from 'react-dom'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createSegment } from '@/actions/segments'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { revalidatePath } from 'next/cache'
import { queryClient } from '@/app/providers'

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2).max(50),
  startsAt: z.string(),
  duration: z.string()
})

const initialState = {
  message: null
}

export function SegmentForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      startsAt: '',
      duration: '1'
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch('/api/segments', {
      method: 'POST',
      body: JSON.stringify(values)
    }).finally(() => {
      queryClient.invalidateQueries('segments')
      form.reset()
    })
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='border p-4 rounded'>
          <p className='mb-4'>Add Segment</p>
          <div className='space-y-6'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Halo: CE' {...field} />
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
                  <Select name={field.name} onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a verified email to display' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='1'>30 mins</SelectItem>
                      <SelectItem value='2'>1 hr</SelectItem>
                      <SelectItem value='3'>1 hr 30 mins</SelectItem>
                      <SelectItem value='4'>2 hr</SelectItem>
                      <SelectItem value='5'>2 hr 30 mins</SelectItem>
                      <SelectItem value='6'>3 hr</SelectItem>
                      <SelectItem value='7'>3 hr 30 mins</SelectItem>
                      <SelectItem value='8'>4 hr</SelectItem>
                      <SelectItem value='9'>4 hr 30 mins</SelectItem>
                      <SelectItem value='10'>5 hr</SelectItem>
                      <SelectItem value='11'>5 hr 30 mins</SelectItem>
                      <SelectItem value='12'>6 hr</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end'>
              <Button type='submit'>Submit</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
