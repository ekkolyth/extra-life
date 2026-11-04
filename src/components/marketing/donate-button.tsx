'use client'

import { convexQuery } from '@convex-dev/react-query'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { participantPageUrl } from '@/utils/extra-life'

export function DonateButton({ className }: { className?: string }) {
    const { data: campaign } = useQuery(convexQuery(api.campaigns.active, {}))

    if (!campaign) {
        return (
            <Button className={className} disabled size='lg'>
                Donate now
            </Button>
        )
    }

    return (
        <Button asChild className={className} size='lg'>
            <Link href={participantPageUrl(campaign.participantId)}>
                Donate now
            </Link>
        </Button>
    )
}
