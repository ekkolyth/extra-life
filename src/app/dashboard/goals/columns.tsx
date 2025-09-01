'use client'

import type { Goal } from '@/types/db'

import { ColumnDef } from '@tanstack/react-table'
import { PencilIcon, TrashIcon } from 'lucide-react'

import { GoalForm } from '@/forms/goal'
import { deleteGoal } from '@/actions/goals'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { USDollar } from '@/utils/currency'
import { Badge } from '@/components/ui/badge'

export const columns: ColumnDef<Goal>[] = [
  {
    accessorKey: 'title',
    header: 'Title'
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell({ row }) {
      return USDollar.format(row.original.amount)
    }
  },
  {
    accessorKey: 'endOfStream',
    header: 'End of Stream',
    cell({ row }) {
      return row.original.endOfStream ? <Badge>End Of Stream</Badge> : undefined
    }
  },
  {
    accessorKey: 'id',
    header(props) {
      return <span className='sr-only'>Actions</span>
    },
    cell({ row }) {
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
          <form action={deleteGoal}>
            <input type='hidden' value={row.original.id} name='id' />
            <Button variant='destructive' size='icon'>
              <span className='sr-only'>Delete</span>
              <TrashIcon />
            </Button>
          </form>
        </div>
      )
    }
  }
]
