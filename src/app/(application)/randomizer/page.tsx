'use client'

import { useConvexQuery } from '@convex-dev/react-query'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { RandomizerForm } from '@/components/forms/randomizer'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { api } from '@/convex/_generated/api'
import type { Randomizer } from '@/types/db'
import { RandomizerCard } from './_components/randomizer-card'

export default function RandomizerPage() {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isDualCreateOpen, setIsDualCreateOpen] = useState(false)
    const convexRandomizers = useConvexQuery(api.randomizer.list, {}) || []

    // Transform Convex data to match expected component types
    const randomizers: Randomizer[] = convexRandomizers.map((r) => ({
        id: r._id,
        name: r.name,
        kind: r.kind,
        firstListName: r.firstListName,
        secondListName: r.secondListName,
        items:
            r.items?.map((item) => ({
                id: item._id,
                name: item.name,
                limit: item.limit,
                redeemed: item.redeemed,
                randomizerId: item.randomizerId,
            })) || [],
        secondItems:
            r.secondItems?.map((item) => ({
                id: item._id,
                name: item.name,
                limit: item.limit,
                redeemed: item.redeemed,
                randomizerId: item.randomizerId,
            })) || [],
        redemptions: [], // TODO: Implement redemptions query
    }))

    return (
        <div className='flex flex-col gap-6'>
            <div className='flex flex-wrap justify-end gap-2'>
                <Dialog onOpenChange={setIsCreateOpen} open={isCreateOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className='text-base'
                            size='lg'
                            variant='outline'
                        >
                            <PlusIcon />
                            Add Randomizer
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-2xl'>
                        <DialogHeader>
                            <DialogTitle className='text-2xl'>
                                New Randomizer
                            </DialogTitle>
                        </DialogHeader>
                        <RandomizerForm
                            onCreated={() => setIsCreateOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
                <Dialog
                    onOpenChange={setIsDualCreateOpen}
                    open={isDualCreateOpen}
                >
                    <DialogTrigger asChild>
                        <Button
                            className='text-base'
                            size='lg'
                            variant='outline'
                        >
                            <PlusIcon />
                            Add Dual Randomizer
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-2xl'>
                        <DialogHeader>
                            <DialogTitle className='text-2xl'>
                                New Dual Randomizer
                            </DialogTitle>
                        </DialogHeader>
                        <RandomizerForm
                            dual
                            onCreated={() => setIsDualCreateOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            {randomizers.map((randomizer: Randomizer) => (
                <RandomizerCard key={randomizer.id} randomizer={randomizer} />
            ))}
        </div>
    )
}
