'use client';

import type { Rotator } from '@/types/db';

import * as z from 'zod';
import { TrashIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
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

export const formSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().optional(),
      text: z.string(),
    })
  ),
});

interface RotatorFormProps {
  items?: Rotator[];
}

export function RotatorForm(props: RotatorFormProps) {
  const { items } = props;

  const createRotator = useConvexMutation(api.rotator.create);
  const updateRotator = useConvexMutation(api.rotator.update);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { items },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Process each item - create new ones, update existing ones
      for (const item of values.items) {
        if (item.id) {
          // Update existing rotator
          await updateRotator({ id: item.id as Id<'rotator'>, text: item.text });
        } else {
          // Create new rotator
          await createRotator({ text: item.text });
        }
      }
    } catch (error) {
      console.error('Failed to save rotators:', error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
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
                    <Input
                      placeholder='shadcn'
                      {...field}
                    />
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => remove(index)}
                    >
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
          variant='outline'
          type='button'
          onClick={() =>
            append({
              text: '',
            })
          }
        >
          Add Item
        </Button>
        <div className='flex justify-end'>
          <Button
            type='submit'
            variant='outline'
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
