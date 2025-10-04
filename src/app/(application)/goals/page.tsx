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
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function GoalsPage() {
  const convexGoals = useQuery(api.goals.list) || [];

  // Transform Convex data to match expected component types
  const goals: Goal[] = convexGoals.map((g) => ({
    id: g._id,
    title: g.title,
    amount: g.amount,
    endOfStream: g.endOfStream,
  }));

  return (
    <div className='flex flex-col gap-4'>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className='self-end'
            variant='outline'
          >
            Create Goal
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Goal</DialogTitle>
          </DialogHeader>
          <GoalForm />
        </DialogContent>
      </Dialog>
      <DataTable
        columns={columns}
        data={goals}
      />
    </div>
  );
}
