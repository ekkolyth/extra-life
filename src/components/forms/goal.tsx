'use client';

import * as z from 'zod';
import { DollarSignIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useConvexMutation } from '@convex-dev/react-query';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { DialogClose } from '@/components/ui/dialog';

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2).max(50),
  amount: z.number().min(1).max(1000000),
  endOfStream: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

interface GoalFormProps {
  defaultValues?: FormData;
}

export function GoalForm(props: GoalFormProps) {
  const { defaultValues } = props;

  const createGoal = useConvexMutation(api.goals.create);
  const updateGoal = useConvexMutation(api.goals.update);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {
      title: '',
      amount: 0,
      endOfStream: false,
    },
  });

  async function onSubmit(values: FormData) {
    try {
      if (values.id) {
        // Update existing goal
        await updateGoal({
          id: values.id as Id<'goals'>,
          title: values.title,
          amount: values.amount,
          endOfStream: values.endOfStream,
        });
      } else {
        // Create new goal
        await createGoal({
          title: values.title,
          amount: values.amount,
          endOfStream: values.endOfStream,
        });
        // Reset form after successful creation
        form.reset();
      }
    } catch (error) {
      console.error('Failed to save goal:', error);
      // You could add a toast notification here
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        {defaultValues?.id && (
          <FormField
            control={form.control}
            name='id'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type='hidden'
                    {...field}
                  />
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
                <Input
                  placeholder='Eat Shit'
                  {...field}
                />
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
                  <Input
                    type='number'
                    step={0.01}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
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
                <Switch
                  checked={value}
                  onCheckedChange={onChange}
                  name={name}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <DialogClose asChild>
          <Button
            type='submit'
            variant='outline'
          >
            Submit
          </Button>
        </DialogClose>
      </form>
    </Form>
  );
}
