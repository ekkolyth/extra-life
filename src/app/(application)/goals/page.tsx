'use client';

import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { GoalForm } from '@/components/original/forms/goal';
import { Button } from '@/components/ui/button';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function GoalsPage() {
  const goals = useQuery(api.goals.list) || [];

  return (
    <div className='flex flex-col gap-4'>
      <Dialog>
        <DialogTrigger asChild>
          <Button className='self-end'>Create Goal</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Goal</DialogTitle>
          </DialogHeader>
          <GoalForm />
        </DialogContent>
      </Dialog>
      <DataTable columns={columns} data={goals} />
    </div>
  );
}
