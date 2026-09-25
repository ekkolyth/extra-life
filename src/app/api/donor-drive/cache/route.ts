import { NextRequest, NextResponse } from 'next/server'
import {
    clearCache,
    clearParticipantCache,
    clearRateLimit,
} from '@/lib/donor-drive-api'

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const action = searchParams.get('action')
        const participantId = searchParams.get('participantId')

        switch (action) {
            case 'all':
                clearCache()
                clearRateLimit()
                console.log('🧹 Cleared all cache and rate limits')
                break
            case 'participant':
                if (participantId) {
                    clearParticipantCache(participantId)
                    console.log(
                        `🧹 Cleared cache for participant: ${participantId}`
                    )
                } else {
                    return NextResponse.json(
                        { error: 'Missing participantId' },
                        { status: 400 }
                    )
                }
                break
            case 'rate-limit':
                clearRateLimit()
                console.log('🧹 Cleared rate limits')
                break
            default:
                clearCache()
                console.log('🧹 Cleared cache')
        }

        return NextResponse.json({ success: true, action })
    } catch (error) {
        console.error('Error clearing cache:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
