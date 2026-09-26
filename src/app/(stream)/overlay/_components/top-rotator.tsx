'use client'

import type { Goal } from '@/types/db'
import type { OverlayData } from '@/types/donor-drive'
import { ControllerIcon } from '../../../../../public/icons/controller'
import { LeftText } from './left-text'
import { RightText } from './right-text'

interface TopRotatorProps {
    data: OverlayData
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
