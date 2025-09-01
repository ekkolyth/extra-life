'use client'

import type { Goal } from '@/types/db'

import ELControllerDice from '@/assets/img/EL_controllerdice.png'
import { LeftText } from './left-text'
import { RightText } from './right-text'

interface TopRotatorProps {
  goals: Goal[]
}

const TopRotator = (props: TopRotatorProps) => {
  const { goals } = props

  return (
    <div style={{ width: 1200, height: 78 }} className='bg-primary rounded-full relative shadow-super'>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ELControllerDice.src}
        alt='controller with dice'
        className='absolute -bottom-2 left-2 h-28 w-auto'
      />
      <div className='ml-44 h-full flex items-center py-1 pl-6 pr-10'>
        <LeftText />
        <RightText goals={goals} />
      </div>
    </div>
  )
}

export default TopRotator
