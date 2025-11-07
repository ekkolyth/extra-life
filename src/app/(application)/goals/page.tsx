'use client';

import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import type { Goal } from '@/types/db';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { GoalForm } from '@/components/forms/goal';
import { Button } from '@/components/ui/button';
import { useConvexQuery } from '@convex-dev/react-query';
import { api } from '@/convex/_generated/api';

export default function GoalsPage() {
  const convexGoals = useConvexQuery(api.goals.list, {}) || [];

  // Transform Convex data to match expected component types
  const goals: Goal[] = convexGoals.map((g) => ({
    id: g._id,
    title: g.title,
    amount: g.amount,
    endOfStream: g.endOfStream,
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
            Create Goal
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='text-2xl'>New Goal</DialogTitle>
          </DialogHeader>
          <GoalForm />
        </DialogContent>
      </Dialog>
      <div className='text-base'>
        <DataTable
          columns={columns}
          data={goals}
        />
      </div>
    </div>
  );
}
