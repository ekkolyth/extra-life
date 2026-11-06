'use client'

import { useConvexMutation } from '@convex-dev/react-query'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import type { Randomizer } from '@/types/db'
import { EditableText } from './editable-text'
import { type ItemTarget, RandomizerList } from './randomizer-list'

type ListKey = 'first' | 'second'

// One field at a time: every save rewrites the whole item list, which
// recreates item ids, so a second open row would lose its draft.
type EditTarget = 'name' | { list: ListKey; target: 'listName' | ItemTarget }

interface CardValues {
    firstListName: string
    items: string[]
    name: string
    secondItems: string[]
    secondListName: string
}

interface RandomizerCardProps {
    randomizer: Randomizer
}

function RandomizerCard(props: RandomizerCardProps) {
    const { randomizer } = props
    const [editing, setEditing] = useState<EditTarget | null>(null)

    const updateRandomizer = useConvexMutation(api.randomizer.update)
    const deleteRandomizer = useConvexMutation(api.randomizer.delete)

    const isDual = randomizer.kind === 'dual'

    function targetIn(list: ListKey) {
        if (
            editing !== null &&
            typeof editing === 'object' &&
            editing.list === list
        ) {
            return editing.target
        }
        return null
    }

    function itemTargetIn(list: ListKey): ItemTarget | null {
        const target = targetIn(list)
        return target === 'listName' ? null : target
    }

    async function save(changes: Partial<CardValues>) {
        const values: CardValues = {
            name: randomizer.name,
            firstListName: randomizer.firstListName ?? '',
            secondListName: randomizer.secondListName ?? '',
            items: randomizer.items.map((item) => item.name),
            secondItems: randomizer.secondItems.map((item) => item.name),
            ...changes,
        }
        try {
            await updateRandomizer({
                id: randomizer.id,
                name: values.name,
                items: {
                    create: values.items.map((itemName) => ({
                        name: itemName,
                    })),
                },
                ...(isDual && {
                    secondItems: {
                        create: values.secondItems.map((itemName) => ({
                            name: itemName,
                        })),
                    },
                    firstListName: values.firstListName,
                    secondListName: values.secondListName,
                }),
            })
            setEditing(null)
        } catch (error) {
            console.error('Failed to save randomizer:', error)
        }
    }

    async function handleDelete() {
        try {
            await deleteRandomizer({ id: randomizer.id })
        } catch (error) {
            console.error('Failed to delete randomizer:', error)
        }
    }

    return (
        <div className='flex flex-col gap-4 rounded-sm border p-4'>
            <header className='flex items-center justify-between gap-4'>
                <EditableText
                    className='text-lg font-semibold'
                    isEditing={editing === 'name'}
                    label='randomizer name'
                    onCancel={() => setEditing(null)}
                    onEdit={() => setEditing('name')}
                    onSave={(name) => save({ name })}
                    value={randomizer.name}
                />
                <Button
                    className='shrink-0'
                    onClick={handleDelete}
                    size='sm'
                    type='button'
                    variant='outline'
                >
                    Delete {randomizer.name}
                </Button>
            </header>
            {isDual ? (
                <div className='grid items-start gap-6 md:grid-cols-2'>
                    <RandomizerList
                        editing={itemTargetIn('first')}
                        heading={
                            <EditableText
                                className='font-semibold'
                                isEditing={targetIn('first') === 'listName'}
                                label={randomizer.firstListName ?? ''}
                                onCancel={() => setEditing(null)}
                                onEdit={() =>
                                    setEditing({
                                        list: 'first',
                                        target: 'listName',
                                    })
                                }
                                onSave={(firstListName) =>
                                    save({ firstListName })
                                }
                                value={randomizer.firstListName ?? ''}
                            />
                        }
                        items={randomizer.items}
                        onCancel={() => setEditing(null)}
                        onChange={(items) => save({ items })}
                        onEdit={(target) =>
                            setEditing({ list: 'first', target })
                        }
                    />
                    <RandomizerList
                        editing={itemTargetIn('second')}
                        heading={
                            <EditableText
                                className='font-semibold'
                                isEditing={targetIn('second') === 'listName'}
                                label={randomizer.secondListName ?? ''}
                                onCancel={() => setEditing(null)}
                                onEdit={() =>
                                    setEditing({
                                        list: 'second',
                                        target: 'listName',
                                    })
                                }
                                onSave={(secondListName) =>
                                    save({ secondListName })
                                }
                                value={randomizer.secondListName ?? ''}
                            />
                        }
                        items={randomizer.secondItems}
                        onCancel={() => setEditing(null)}
                        onChange={(secondItems) => save({ secondItems })}
                        onEdit={(target) =>
                            setEditing({ list: 'second', target })
                        }
                    />
                </div>
            ) : (
                <RandomizerList
                    editing={itemTargetIn('first')}
                    heading={<h4 className='font-semibold'>Items</h4>}
                    items={randomizer.items}
                    onCancel={() => setEditing(null)}
                    onChange={(items) => save({ items })}
                    onEdit={(target) => setEditing({ list: 'first', target })}
                />
            )}
        </div>
    )
}

export { RandomizerCard }
