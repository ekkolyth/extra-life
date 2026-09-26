'use client'

import { useConvexQuery } from '@convex-dev/react-query'
import { Overview } from '@/app/(application)/dashboard/_components/overview'
import { RecentDonations } from '@/app/(application)/dashboard/_components/recent-donations'
import { ScheduleSection } from '@/app/(application)/dashboard/_components/schedule'
import { EnvCheck } from '@/components/env-check'
import { api } from '@/convex/_generated/api'
import { useCampaign } from '@/hooks/use-campaign'
import { useLatestDonations } from '@/hooks/use-donations'
import { useTopDonor } from '@/hooks/use-top-donor'
import type { Goal, Segment } from '@/types/db'

export default function AdminPage() {
    const convexSegments = useConvexQuery(api.segment.list, {})
    const convexGoals = useConvexQuery(api.goals.list, {})

    const { data: campaign, isPending } = useCampaign()
    const { data: latestDonations } = useLatestDonations(10)
    const { data: topDonor } = useTopDonor()

    const segments: Segment[] = (convexSegments || []).map((s) => ({
        id: s._id,
        title: s.title,
        startsAt: s.startsAt,
        duration: s.duration,
    }))

    const goals: Goal[] = (convexGoals || []).map((g) => ({
        id: g._id,
        title: g.title,
        amount: g.amount,
        endOfStream: g.endOfStream,
    }))

    return (
        <div className='space-y-4'>
            <EnvCheck />
            <div className='space-y-6'>
                <Overview
                    data={{
                        sumDonations: campaign?.sumDonations ?? 0,
                        fundraisingGoal: campaign?.fundraisingGoal || 2000,
                        numDonations: campaign?.numDonations ?? 0,
                    }}
                    goals={goals}
                    isLoading={isPending}
                    topDonor={topDonor ?? null}
                />

                <div className='grid md:grid-cols-2 gap-6'>
                    <ScheduleSection segments={segments} />
                    <RecentDonations
                        donations={latestDonations ?? []}
                        isLoading={isPending}
                    />
                </div>
            </div>
        </div>
    )
}
