'use client'

import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { api } from '@/convex/_generated/api'

// datetime-local wants local wall-clock time with no zone suffix
function toDateTimeLocal(epochMs: number) {
    const date = new Date(epochMs)
    const offsetMs = date.getTimezoneOffset() * 60_000
    return new Date(epochMs - offsetMs).toISOString().slice(0, 16)
}

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

    const setStreamEndsAt = useMutation({
        mutationFn: useConvexMutation(api.campaigns.setStreamEndsAt),
    })
    const [draftStreamEndsAt, setDraftStreamEndsAt] = useState<string | null>(
        null
    )
    const savedStreamEndsAt =
        campaign?.streamEndsAt === undefined
            ? ''
            : toDateTimeLocal(campaign.streamEndsAt)
    const streamEndsAt = draftStreamEndsAt ?? savedStreamEndsAt

    const handleStreamEndsAtSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault()
        // parsed as local time because the string has no zone suffix
        setStreamEndsAt.mutate(
            { streamEndsAt: new Date(streamEndsAt).getTime() },
            { onSuccess: () => setDraftStreamEndsAt(null) }
        )
    }

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
            <form
                className='flex max-w-xs flex-col gap-2'
                onSubmit={handleStreamEndsAtSubmit}
            >
                <Label htmlFor='stream-ends-at'>Stream ends at</Label>
                <div className='flex gap-2'>
                    <Input
                        disabled={!campaign}
                        id='stream-ends-at'
                        name='streamEndsAt'
                        onChange={(event) =>
                            setDraftStreamEndsAt(event.target.value)
                        }
                        type='datetime-local'
                        value={streamEndsAt}
                    />
                    <Button
                        disabled={
                            !campaign ||
                            setStreamEndsAt.isPending ||
                            streamEndsAt === '' ||
                            streamEndsAt === savedStreamEndsAt
                        }
                        type='submit'
                    >
                        Save
                    </Button>
                </div>
                {setStreamEndsAt.error && (
                    <p className='text-sm text-destructive'>
                        {setStreamEndsAt.error.message}
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
