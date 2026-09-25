'use client'

import { useConvexQuery } from '@convex-dev/react-query'
import { Overview } from '@/app/(application)/dashboard/_components/overview'
import { RecentDonations } from '@/app/(application)/dashboard/_components/recent-donations'
import { ScheduleSection } from '@/app/(application)/dashboard/_components/schedule'
import { EnvCheck } from '@/components/env-check'
import { api } from '@/convex/_generated/api'
import { useDonorDrive } from '@/hooks/use-donor-drive'
import type { Goal, Segment } from '@/types/db'

export default function AdminPage() {
    const convexSegments = useConvexQuery(api.segment.list, {})
    const convexGoals = useConvexQuery(api.goals.list, {})

    // Use the simple hook
    const {
        data: donorDriveData,
        isLoading: donorDriveLoading,
        error: donorDriveError,
    } = useDonorDrive()

    // Debug logging
    console.log('Dashboard Debug:', {
        donorDriveData,
        isLoading: donorDriveLoading,
        error: donorDriveError,
    })

    // Show the dashboard immediately with whatever data we have
    // Data will update automatically when fresh data arrives

    // Show dashboard even if there are errors - data will update when available

    // Transform Convex data to match expected component types
    // Use empty arrays as fallback for undefined data (optimistic loading)
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

    // Create combined data from Convex data (now flat structure)
    const combinedData = donorDriveData
        ? {
              displayName: donorDriveData.displayName || 'Loading...',
              fundraisingGoal: donorDriveData.fundraisingGoal || 2000,
              eventName: donorDriveData.eventName || 'Demo Event',
              streamIsEnabled: donorDriveData.streamIsEnabled || false,
              streamingChannel: donorDriveData.streamingChannel || '',
              streamingPlatform: donorDriveData.streamingPlatform || '',
              avatarImageURL: donorDriveData.avatarImageURL || '',
              participantID: donorDriveData.participantId
                  ? parseInt(donorDriveData.participantId, 10)
                  : 0,
              sumDonations: donorDriveData.sumDonations || 0,
              sumPledges: donorDriveData.sumPledges || 0,
              numDonations: donorDriveData.numDonations || 0,
              streamIsLive: donorDriveData.streamIsLive || false,
              latestDonations: donorDriveData.latestDonations || [],
              topDonor: donorDriveData.topDonor || null,
              links: { donate: '', page: '', stream: '' },
              teamName: '',
              isTeamCaptain: false,
              isTeamCoCaptain: false,
              role: '',
              hasActivityTracking: false,
              numIncentives: 0,
              numMilestones: 0,
          }
        : {
              // Fallback data
              displayName: 'Loading...',
              fundraisingGoal: 2000,
              eventName: 'Demo Event',
              links: { donate: '', page: '', stream: '' },
              streamIsEnabled: false,
              streamingChannel: '',
              streamingPlatform: '',
              avatarImageURL: '',
              participantID: 0,
              teamName: '',
              isTeamCaptain: false,
              isTeamCoCaptain: false,
              role: '',
              hasActivityTracking: false,
              numIncentives: 0,
              numMilestones: 0,
              sumDonations: 0,
              sumPledges: 0,
              numDonations: 0,
              streamIsLive: false,
              latestDonations: [],
              topDonor: null,
          }

    const recentDonations = combinedData.latestDonations || []

    return (
        <div className='space-y-4'>
            <EnvCheck />
            <div className='space-y-6'>
                <Overview
                    data={combinedData}
                    goals={goals}
                    isLoading={donorDriveLoading}
                    topDonor={combinedData.topDonor}
                />

                <div className='grid md:grid-cols-2 gap-6'>
                    <ScheduleSection segments={segments} />
                    <RecentDonations
                        donations={recentDonations}
                        isLoading={donorDriveLoading}
                    />
                </div>
            </div>
        </div>
    )
}
