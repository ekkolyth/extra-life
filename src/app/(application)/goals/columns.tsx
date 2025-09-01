'use client';

import type { Goal } from '@/types/db';

import { PencilIcon, TrashIcon } from 'lucide-react';

import { GoalForm } from '@/components/original/forms/goal';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { USDollar } from '@/utils/currency';
import { Badge } from '@/components/ui/badge';

export const columns = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: (row: { original: Goal }) => USDollar.format(row.original.amount),
  },
  {
    accessorKey: 'endOfStream',
    header: 'End of Stream',
    cell: (row: { original: Goal }) => {
      return row.original.endOfStream ? <Badge>End Of Stream</Badge> : undefined;
    },
  },
  {
    accessorKey: 'id',
    header: () => <span className='sr-only'>Actions</span>,
    cell: (row: { original: Goal }) => {
      return (
        <div className='flex justify-end gap-4'>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='secondary' size='icon'>
                <span className='sr-only'>Edit</span>
                <PencilIcon />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Goal</DialogTitle>
              </DialogHeader>
              <GoalForm defaultValues={row.original} />
            </DialogContent>
          </Dialog>
          <form
            action={async (formData) => {
              // TODO: Implement Convex mutation for deleting goals
              console.log('Delete goal:', row.original.id);
            }}
          >
            <input type='hidden' value={row.original.id} name='id' />
            <Button variant='destructive' size='icon'>
              <span className='sr-only'>Delete</span>
              <TrashIcon />
            </Button>
          </form>
        </div>
      );
    },
  },
];
