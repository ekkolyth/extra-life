'use client'

import { CheckIcon, PencilIcon, XIcon } from 'lucide-react'
import { type KeyboardEvent, type ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

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

export { EditableText }
