'use client';

import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import type { Rotator } from '@/types/db';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RotatorForm } from '@/components/forms/rotator';
import { Button } from '@/components/ui/button';
import { useConvexQuery } from '@convex-dev/react-query';
import { api } from '@/convex/_generated/api';

export default function RotatorPage() {
  const convexRotators = useConvexQuery(api.rotator.list, {}) || [];

  // Transform Convex data to match expected component types
  const rotators: Rotator[] = convexRotators.map((r) => ({
    id: r._id,
    text: r.text,
  }));

  return (
    <div className='flex flex-col gap-6'>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className='self-end text-base'
            variant='outline'
            size='lg'
          >
            Add Rotator
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='text-2xl'>New Rotator</DialogTitle>
          </DialogHeader>
          <RotatorForm />
        </DialogContent>
      </Dialog>
      <div className='text-base'>
        <DataTable
          columns={columns}
          data={rotators}
        />
      </div>
    </div>
  );
}
