'use client'

import type { Goal } from '@/types/db'
import { ControllerIcon } from '../../../../../public/icons/controller'
import { LeftText } from './left-text'
import { RightText } from './right-text'

interface TopRotatorProps {
    data: {
        displayName: string
        fundraisingGoal: number
        eventName: string
        links: { donate: string; page: string; stream: string }
        streamIsEnabled: boolean
        streamingChannel: string
        streamingPlatform: string
        avatarImageURL: string
        participantID: number
        teamName: string
        isTeamCaptain: boolean
        isTeamCoCaptain: boolean
        role: string
        hasActivityTracking: boolean
        numIncentives: number
        numMilestones: number
        sumDonations: number
        sumPledges: number
        numDonations: number
        streamIsLive: boolean
        latestDonations: Array<{
            amount: number
            avatarImageURL?: string
            createdDateUTC?: string
            donationID?: string
            displayName?: string
            donorID?: string
            eventID?: number
            isRegFee?: boolean
            message?: string
            modifiedDateUTC?: string
            participantID?: number
            recipientImageURL?: string
            recipientName?: string
            teamID?: number
        }>
        topDonor: {
            displayName?: string
            donorID?: string
            avatarImageURL: string
            modifiedDateUTC: string
            sumDonations: number
            numDonations: number
            recipientImageURL?: string
        } | null
    }
    goals: Goal[]
}

const TopRotator = (props: TopRotatorProps) => {
    const { goals, data } = props

    return (
        <div
            className='bg-primary rounded-full relative shadow-super'
            style={{ width: 1200, height: 78 }}
        >
            <div className='ml-8 mr-8 h-full flex items-center py-2 pl-6 pr-10'>
                <ControllerIcon className='h-full mr-4' />
                <LeftText data={data} />
                <RightText data={data} goals={goals} />
            </div>
        </div>
    )
}

export default TopRotator
