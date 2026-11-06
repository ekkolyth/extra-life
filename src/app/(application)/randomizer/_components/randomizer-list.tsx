'use client'

import { TrashIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import type { RandomizerItem } from '@/types/db'
import { EditableText } from './editable-text'

type ItemTarget = 'new' | number

interface RandomizerListProps {
    editing: ItemTarget | null
    heading: ReactNode
    items: RandomizerItem[]
    onCancel: () => void
    onChange: (itemNames: string[]) => Promise<void>
    onEdit: (target: ItemTarget) => void
}

function RandomizerList(props: RandomizerListProps) {
    const { editing, heading, items, onCancel, onChange, onEdit } = props

    const itemNames = items.map((item) => item.name)

    return (
        <section className='flex flex-col items-start gap-2'>
            {heading}
            <ul className='w-full divide-y'>
                {itemNames.map((itemName, index) => (
                    <li className='py-3' key={items[index].id}>
                        <EditableText
                            isEditing={editing === index}
                            label={itemName}
                            onCancel={() => onCancel()}
                            onEdit={() => onEdit(index)}
                            onSave={(name) =>
                                onChange(
                                    itemNames.map((existing, i) =>
                                        i === index ? name : existing
                                    )
                                )
                            }
                            value={itemName}
                        >
                            <Button
                                className='shrink-0'
                                onClick={() =>
                                    onChange(
                                        itemNames.filter((_, i) => i !== index)
                                    )
                                }
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
                            onCancel={() => onCancel()}
                            onEdit={() => onEdit('new')}
                            onSave={(name) => onChange([...itemNames, name])}
                            placeholder='Demo Item'
                            value=''
                        />
                    </li>
                )}
            </ul>
            <Button
                onClick={() => onEdit('new')}
                type='button'
                variant='outline'
            >
                Add Item
            </Button>
        </section>
    )
}

export type { ItemTarget }
export { RandomizerList }
