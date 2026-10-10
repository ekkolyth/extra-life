'use client'

import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { api } from '@/convex/_generated/api'

export default function ConfigPage() {
    const { data: campaign } = useQuery(convexQuery(api.campaigns.active, {}))
    const setParticipantId = useMutation({
        mutationFn: useConvexMutation(api.campaigns.setParticipantId),
    })
    const setLivePolling = useMutation({
        mutationFn: useConvexMutation(api.sync.setLivePolling),
    })
    // null until edited, so the field follows the saved value
    const [draftParticipantId, setDraftParticipantId] = useState<string | null>(
        null
    )
    const participantId = draftParticipantId ?? campaign?.participantId ?? ''

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setParticipantId.mutate(
            { participantId },
            { onSuccess: () => setDraftParticipantId(null) }
        )
    }

    return (
        <div className='flex flex-col gap-8'>
            <h1 className='text-2xl font-semibold tracking-tight'>Settings</h1>
            <form
                className='flex max-w-xs flex-col gap-2'
                onSubmit={handleSubmit}
            >
                <Label htmlFor='participant-id'>Participant ID</Label>
                <div className='flex gap-2'>
                    <Input
                        disabled={!campaign}
                        id='participant-id'
                        name='participantId'
                        onChange={(event) =>
                            setDraftParticipantId(event.target.value)
                        }
                        value={participantId}
                    />
                    <Button
                        disabled={
                            !campaign ||
                            setParticipantId.isPending ||
                            participantId.trim() === '' ||
                            participantId.trim() === campaign.participantId
                        }
                        type='submit'
                    >
                        Save
                    </Button>
                </div>
                {setParticipantId.error && (
                    <p className='text-sm text-destructive'>
                        {setParticipantId.error.message}
                    </p>
                )}
            </form>
            <div className='flex items-center gap-2'>
                <Switch
                    checked={campaign?.livePolling ?? false}
                    disabled={!campaign || setLivePolling.isPending}
                    id='live-polling'
                    onCheckedChange={(enabled) =>
                        setLivePolling.mutate({ enabled })
                    }
                />
                <Label htmlFor='live-polling'>Live polling</Label>
            </div>
        </div>
    )
}
