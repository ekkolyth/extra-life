'use client'

import type { Goal } from '@/types/db'

import { PencilIcon, TrashIcon } from 'lucide-react'
import { useConvexMutation } from '@convex-dev/react-query'
import { api } from '@/convex/_generated/api'

import { GoalForm } from '@/components/forms/goal'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { USDollar } from '@/utils/currency'
import { Badge } from '@/components/ui/badge'

// Component for the actions column to properly use React hooks
function GoalActions({ goal }: { goal: Goal }) {
    const deleteGoal = useConvexMutation(api.goals.removeGoal)

    const handleDelete = async () => {
        try {
            await deleteGoal({ id: goal.id })
        } catch (error) {
            console.error('Failed to delete goal:', error)
        }
    }

    return (
        <div className='flex justify-end gap-4'>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant='outline' size='icon'>
                        <span className='sr-only'>Edit</span>
                        <PencilIcon />
                    </Button>
                </DialogTrigger>
                <DialogContent className='max-w-2xl'>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>
                            Edit Goal
                        </DialogTitle>
                    </DialogHeader>
                    <GoalForm defaultValues={goal} />
                </DialogContent>
            </Dialog>
            <Button variant='outline' size='icon' onClick={handleDelete}>
                <span className='sr-only'>Delete</span>
                <TrashIcon />
            </Button>
        </div>
    )
}

export const columns = [
    {
        accessorKey: 'title',
        header: <span className='text-lg font-semibold'>Title</span>,
        cell: (row: { original: Goal }) => (
            <span className='text-lg'>{row.original.title}</span>
        ),
    },
    {
        accessorKey: 'amount',
        header: <span className='text-lg font-semibold'>Amount</span>,
        cell: (row: { original: Goal }) => (
            <span className='text-lg'>
                {USDollar.format(row.original.amount)}
            </span>
        ),
    },
    {
        accessorKey: 'endOfStream',
        header: <span className='text-lg font-semibold'>End of Stream</span>,
        cell: (row: { original: Goal }) => {
            return row.original.endOfStream ? (
                <Badge className='text-base'>End Of Stream</Badge>
            ) : undefined
        },
    },
    {
        accessorKey: 'id',
        header: <span className='sr-only'>Actions</span>,
        cell: (row: { original: Goal }) => <GoalActions goal={row.original} />,
    },
]
