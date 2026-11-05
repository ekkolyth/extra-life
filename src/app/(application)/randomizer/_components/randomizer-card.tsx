'use client'

import { useConvexMutation } from '@convex-dev/react-query'
import { CheckIcon, PencilIcon, TrashIcon, XIcon } from 'lucide-react'
import { type KeyboardEvent, type ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import type { Randomizer } from '@/types/db'

// One field at a time: every save rewrites the whole item list, which
// recreates item ids, so a second open row would lose its draft.
type EditTarget = 'name' | 'new' | number

interface RandomizerCardProps {
    randomizer: Randomizer
}

function RandomizerCard(props: RandomizerCardProps) {
    const { randomizer } = props
    const [editing, setEditing] = useState<EditTarget | null>(null)

    const updateRandomizer = useConvexMutation(api.randomizer.update)
    const deleteRandomizer = useConvexMutation(api.randomizer.delete)

    const itemNames = randomizer.items.map((item) => item.name)

    async function save(name: string, items: string[]) {
        try {
            await updateRandomizer({
                id: randomizer.id,
                name,
                items: {
                    create: items.map((itemName) => ({ name: itemName })),
                },
            })
            setEditing(null)
        } catch (error) {
            console.error('Failed to save randomizer:', error)
        }
    }

    async function removeItem(index: number) {
        await save(
            randomizer.name,
            itemNames.filter((_, i) => i !== index)
        )
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
                    onSave={(name) => save(name, itemNames)}
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
            <section className='flex flex-col items-start gap-2'>
                <h4 className='font-semibold'>Items</h4>
                <ul className='w-full divide-y'>
                    {itemNames.map((itemName, index) => (
                        <li className='py-3' key={randomizer.items[index].id}>
                            <EditableText
                                isEditing={editing === index}
                                label={itemName}
                                onCancel={() => setEditing(null)}
                                onEdit={() => setEditing(index)}
                                onSave={(name) =>
                                    save(
                                        randomizer.name,
                                        itemNames.map((existing, i) =>
                                            i === index ? name : existing
                                        )
                                    )
                                }
                                value={itemName}
                            >
                                <Button
                                    className='shrink-0'
                                    onClick={() => removeItem(index)}
                                    size='icon'
                                    type='button'
                                    variant='outline'
                                >
                                    <span className='sr-only'>
                                        Remove {itemName}
                                    </span>
                                    <TrashIcon />
                                </Button>
                            </EditableText>
                        </li>
                    ))}
                    {editing === 'new' && (
                        <li className='py-3'>
                            <EditableText
                                isEditing
                                label='new item'
                                onCancel={() => setEditing(null)}
                                onEdit={() => setEditing('new')}
                                onSave={(name) =>
                                    save(randomizer.name, [...itemNames, name])
                                }
                                placeholder='Demo Item'
                                value=''
                            />
                        </li>
                    )}
                </ul>
                <Button
                    onClick={() => setEditing('new')}
                    type='button'
                    variant='outline'
                >
                    Add Item
                </Button>
            </section>
        </div>
    )
}

interface EditableTextProps {
    children?: ReactNode
    className?: string
    isEditing: boolean
    label: string
    onCancel: () => void
    onEdit: () => void
    onSave: (value: string) => Promise<void>
    placeholder?: string
    value: string
}

function EditableText(props: EditableTextProps) {
    const {
        value,
        label,
        isEditing,
        onEdit,
        onCancel,
        onSave,
        placeholder,
        className,
        children,
    } = props
    const [draft, setDraft] = useState(value)
    const [isSaving, setIsSaving] = useState(false)

    const trimmed = draft.trim()
    const isChanged = trimmed !== value
    const canSave = isChanged && trimmed !== '' && !isSaving

    function startEditing() {
        setDraft(value)
        onEdit()
    }

    async function commit() {
        if (!canSave) return
        setIsSaving(true)
        await onSave(trimmed)
        setIsSaving(false)
    }

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            event.preventDefault()
            commit()
        } else if (event.key === 'Escape') {
            onCancel()
        }
    }

    if (!isEditing) {
        return (
            <div className='flex min-w-0 flex-1 items-center gap-2'>
                <span className={cn('min-w-0 flex-1 truncate', className)}>
                    {value}
                </span>
                <Button
                    className='shrink-0'
                    onClick={startEditing}
                    size='icon'
                    type='button'
                    variant='outline'
                >
                    <span className='sr-only'>Edit {label}</span>
                    <PencilIcon />
                </Button>
                {children}
            </div>
        )
    }

    return (
        <div className='flex min-w-0 flex-1 items-center gap-2'>
            <Input
                aria-label={label}
                autoComplete='off'
                autoFocus
                className='flex-1'
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                value={draft}
            />
            {isChanged ? (
                <Button
                    className='shrink-0'
                    disabled={!canSave}
                    onClick={commit}
                    size='icon'
                    type='button'
                    variant='outline'
                >
                    <span className='sr-only'>Save {label}</span>
                    <CheckIcon />
                </Button>
            ) : (
                <Button
                    className='shrink-0'
                    onClick={onCancel}
                    size='icon'
                    type='button'
                    variant='outline'
                >
                    <span className='sr-only'>Cancel editing {label}</span>
                    <XIcon />
                </Button>
            )}
            {children}
        </div>
    )
}

export { RandomizerCard }
