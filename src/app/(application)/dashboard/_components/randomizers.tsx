import { useConvexMutation } from '@convex-dev/react-query'
import { useMutation } from '@tanstack/react-query'
import { Plus, Shuffle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/convex/_generated/api'
import type { Randomizer } from '@/types/db'

interface RandomizersSectionProps {
    randomizers: Randomizer[]
}

export function RandomizersSection({ randomizers }: RandomizersSectionProps) {
    const {
        mutate: trigger,
        isPending,
        variables,
    } = useMutation({
        mutationFn: useConvexMutation(api.randomizerSpin.trigger),
        onError: (error) =>
            console.error('Failed to trigger randomizer:', error),
    })

    if (randomizers.length === 0) {
        return (
            <Card className='border-border/50 bg-card/50 backdrop-blur-sm'>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <Shuffle className='h-5 w-5 text-primary' />
                        Randomizers
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='rounded-lg bg-muted/30 p-4'>
                        <p className='text-sm text-muted-foreground text-center'>
                            No randomizers found
                        </p>
                    </div>

                    <Button
                        asChild
                        className='w-full bg-transparent'
                        size='sm'
                        variant='outline'
                    >
                        <Link href='/randomizer'>
                            <Plus className='h-4 w-4 mr-2' />
                            Add one
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <Shuffle className='h-5 w-5 text-primary' />
                    Randomizers
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='rounded-lg bg-muted/30 p-4'>
                    <ul className='space-y-2'>
                        {randomizers.map((randomizer) => (
                            <li
                                className='flex justify-between items-center gap-3 text-sm'
                                key={randomizer.id}
                            >
                                <span className='min-w-0 truncate text-foreground'>
                                    {randomizer.name}
                                </span>
                                <span className='ml-auto shrink-0 text-muted-foreground'>
                                    {randomizer.items.length} items
                                </span>
                                <Button
                                    disabled={
                                        randomizer.items.length === 0 ||
                                        (isPending &&
                                            variables?.randomizerId ===
                                                randomizer.id)
                                    }
                                    onClick={() =>
                                        trigger({ randomizerId: randomizer.id })
                                    }
                                    size='sm'
                                    type='button'
                                    variant='outline'
                                >
                                    Trigger
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>

                <Button
                    asChild
                    className='w-full bg-transparent'
                    size='sm'
                    variant='outline'
                >
                    <Link href='/randomizer'>
                        <Plus className='h-4 w-4 mr-2' />
                        Manage Randomizers
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
}
