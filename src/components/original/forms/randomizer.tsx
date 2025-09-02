/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client';

import type { Randomizer } from '@/types/db';

import * as z from 'zod';
import { TrashIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { useMutation } from 'convex/react';
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
  name: z.string().min(2),
  items: z.array(
    z.object({
      name: z.string(),
      limit: z.coerce.number().int().positive(),
      redeemed: z.coerce.number().int().optional(),
    })
  ),
});

interface RandomizerFormProps {
  randomizer?: Randomizer;
}

export function RandomizerForm(props: RandomizerFormProps) {
  const { randomizer } = props;

  const createRandomizer = useMutation(api.randomizer.create);
  const updateRandomizer = useMutation(api.randomizer.update);
  const deleteRandomizer = useMutation(api.randomizer.delete);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: randomizer ?? {
      name: '',
      items: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (randomizer) {
        // Update existing randomizer
        await updateRandomizer({
          id: randomizer.id as Id<'randomizers'>,
          name: values.name,
          items: values.items.map((item) => ({
            name: item.name,
            limit: item.limit,
            redeemed: item.redeemed || 0,
          })),
        });
      } else {
        // Create new randomizer
        await createRandomizer({
          name: values.name,
          items: values.items.map((item) => ({
            name: item.name,
            limit: item.limit,
            redeemed: item.redeemed || 0,
          })),
        });
      }
    } catch (error) {
      console.error('Failed to save randomizer:', error);
    }
  }

  async function handleDelete() {
    if (!randomizer) return;

    try {
      await deleteRandomizer({ id: randomizer.id as Id<'randomizers'> });
    } catch (error) {
      console.error('Failed to delete randomizer:', error);
    }
  }

  return (
    <div className='border rounded p-4'>
      <header className='flex items-start justify-between'>
        <h3 className='text-lg font-semibold pb-4'>
          {randomizer ? 'Edit Randomizer' : 'New Randomizer'}
        </h3>
        {randomizer && (
          <Button type='button' size='sm' variant='outline' onClick={handleDelete}>
            Delete {randomizer.name}
          </Button>
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
                  <Button type='button' size='icon' variant='outline' onClick={() => remove(index)}>
                    <span className='sr-only'>Remove</span>
                    <TrashIcon />
                  </Button>
                </div>
              ))}
            <Button
              type='button'
              variant='outline'
              onClick={() => append({ name: '', limit: 1, redeemed: 0 })}
              className='mt-4'
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
  );
}
