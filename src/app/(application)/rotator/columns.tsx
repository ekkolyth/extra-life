'use client';

import type { Rotator } from '@/types/db';

import { PencilIcon, TrashIcon } from 'lucide-react';
import { useConvexMutation } from '@convex-dev/react-query';
import { api } from '@/convex/_generated/api';

import { RotatorForm } from '@/components/forms/rotator';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Component for the actions column to properly use React hooks
function RotatorActions({ rotator }: { rotator: Rotator }) {
  const deleteRotator = useConvexMutation(api.rotator.remove);

  const handleDelete = async () => {
    try {
      await deleteRotator({ id: rotator.id });
    } catch (error) {
      console.error('Failed to delete rotator:', error);
    }
  };

  return (
    <div className='flex justify-end gap-4'>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant='outline'
            size='icon'
          >
            <span className='sr-only'>Edit</span>
            <PencilIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='text-2xl'>Edit Rotator</DialogTitle>
          </DialogHeader>
          <RotatorForm defaultValues={rotator} />
        </DialogContent>
      </Dialog>
      <Button
        variant='outline'
        size='icon'
        onClick={handleDelete}
      >
        <span className='sr-only'>Delete</span>
        <TrashIcon />
      </Button>
    </div>
  );
}

export const columns = [
  {
    accessorKey: 'text',
    header: <span className='text-lg font-semibold'>Text</span>,
    cell: (row: { original: Rotator }) => (
      <span className='text-lg'>{row.original.text}</span>
    ),
  },
  {
    accessorKey: 'id',
    header: <span className='sr-only'>Actions</span>,
    cell: (row: { original: Rotator }) => <RotatorActions rotator={row.original} />,
  },
];

