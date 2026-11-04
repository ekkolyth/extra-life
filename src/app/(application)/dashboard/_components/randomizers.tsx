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
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <div className='flex size-8 shrink-0 items-center justify-center rounded-sm border'>
                            <Shuffle className='size-4 text-primary' />
                        </div>
                        Randomizers
                    </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col gap-4'>
                    <p className='py-6 text-center text-base sm:text-sm text-muted-foreground'>
                        No randomizers found
                    </p>
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
                    <div className='flex size-8 shrink-0 items-center justify-center rounded-sm border'>
                        <Shuffle className='size-4 text-primary' />
                    </div>
                    Randomizers
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className='divide-y'>
                    {randomizers.map((randomizer) => (
                        <li
                            className='flex items-center gap-3 py-3 text-base sm:text-sm first:pt-0 last:pb-0'
                            key={randomizer.id}
                        >
                            <p className='min-w-0 flex-1 truncate font-medium text-foreground'>
                                {randomizer.name}
                            </p>
                            <p className='shrink-0 tabular-nums text-muted-foreground'>
                                {randomizer.items.length} items
                            </p>
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
            </CardContent>
        </Card>
    )
}
