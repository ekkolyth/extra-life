'use client';

import type { Rotator } from '@/types/db';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useConvexMutation } from '@convex-dev/react-query';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

import { Input } from '@/components/ui/input';
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
  text: z.string().min(1, 'Text is required'),
});

type FormData = z.infer<typeof formSchema>;

interface RotatorFormProps {
  defaultValues?: FormData;
}

export function RotatorForm(props: RotatorFormProps) {
  const { defaultValues } = props;

  const createRotator = useConvexMutation(api.rotator.create);
  const updateRotator = useConvexMutation(api.rotator.update);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {
      text: '',
    },
  });

  async function onSubmit(values: FormData) {
    try {
      if (values.id) {
        // Update existing rotator
        await updateRotator({
          id: values.id as Id<'rotator'>,
          text: values.text,
        });
      } else {
        // Create new rotator
        await createRotator({ text: values.text });
        // Reset form after successful creation
        form.reset();
      }
    } catch (error) {
      console.error('Failed to save rotator:', error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6'
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
          name='text'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-base font-semibold'>Text</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter rotator text...'
                  className='text-base'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogClose asChild>
          <Button
            type='submit'
            variant='outline'
            className='text-base'
            size='lg'
          >
            Submit
          </Button>
        </DialogClose>
      </form>
    </Form>
  );
}
