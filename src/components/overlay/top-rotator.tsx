'use client'

import type { Goal, Segment } from '@prisma/client'

import { useQuery } from 'react-query'
import { useEffect, useState } from 'react'
import TextTransition, { presets } from 'react-text-transition'

import Hashtags from '@/data/hashtags.json'
import { useSegments } from '@/utils/useSegments'
import ELControllerDice from '@/assets/img/EL_controllerdice.png'
import { fetchTopDonation, fetchStats } from 'src/utils/donor-drive'

interface TopRotatorProps {
  goals: Goal[]
}

const TopRotator = (props: TopRotatorProps) => {
  const { goals } = props
  const rotationInterval = 7000
  const { data: stats } = useQuery(
    ['extralife', 'donors'],
    () => fetchStats(String(process.env.NEXT_PUBLIC_DONORDRIVE_ID)),
    {
      refetchInterval: rotationInterval
    }
  )
  const { data: topDonation } = useQuery(['extralife', 'topDonation'], () =>
    fetchTopDonation(String(process.env.NEXT_PUBLIC_DONORDRIVE_ID))
  )
  const { data: segments } = useQuery(
    ['segments'],
    () => fetch('/api/segments').then(res => res.json()) as Promise<Segment[]>,
    {
      refetchInterval: rotationInterval
    }
  )

  const { currentSegment, nextSegment } = useSegments(segments)
  const [bonusTextIndex, setBonusTextIndex] = useState<number>(0)
  const [hashtagIndex, setHashtagIndex] = useState<number>(0)
  const nextGoal =
    stats?.sumDonations && goals && goals.length ? goals?.find(goal => goal.amount > stats?.sumDonations) : undefined

  const bonusText: { label: string; text: string }[] = [
    {
      label: 'right now',
      text: currentSegment?.title ?? 'loading...'
    },
    {
      label: 'up next',
      text: nextSegment?.title ?? 'loading...'
    },
    {
      label: 'top donation',
      text: `${topDonation?.displayName ?? 'Your Mom'} - $${topDonation?.amount ?? '69'}`
    },
    {
      label: 'next goal unlock',
      text: `${nextGoal?.title}${nextGoal?.endOfStream ? ` - End Of Stream` : ''}` ?? 'complete!'
    }
  ]

  const [mainText, setMainText] = useState(<p>{Hashtags[0]}</p>)
  const [secondaryLabel, setSecondaryLabel] = useState(bonusText[0]?.label)
  const [secondaryText, setSecondaryText] = useState(bonusText[0]?.text)

  // Rotate through the hashtags array as the main text every second
  // After the hashtags, display a string, then start over
  const rotateHashtags = () => {
    setMainText(<p>{Hashtags[hashtagIndex]}</p>)
    setHashtagIndex(prevIndex => (prevIndex + 1) % Hashtags.length)
  }
  const rotateBonusText = () => {
    setSecondaryLabel(bonusText[bonusTextIndex]?.label ?? 'nothing')
    setSecondaryText(bonusText[bonusTextIndex]?.text ?? 'nothing')
    setBonusTextIndex(prevIndex => (prevIndex + 1) % bonusText.length)
  }

  // Rotate the hashtags every 10 seconds
  useEffect(() => {
    const bonusText = setInterval(rotateBonusText, rotationInterval)
    const hashtags = setInterval(rotateHashtags, rotationInterval)
    return () => {
      clearInterval(bonusText)
      clearInterval(hashtags)
    }
  }, [hashtagIndex, bonusTextIndex])

  if (!stats || !topDonation) {
    return null
  }

  return (
    <div style={{ width: 1200, height: 78 }} className='bg-primary rounded-full relative shadow-super'>
      <img src={ELControllerDice.src} className='absolute -bottom-2 left-2 h-28 w-auto' />
      <div className='ml-44 flex items-center py-1 pl-6 pr-10'>
        <TextTransition springConfig={presets.stiff} className='text-white font-bold text-2xl truncate'>
          {mainText}
        </TextTransition>
        <div className='flex-grow flex justify-end py-1'>
          <div className='text-right'>
            <p className='text-2xl font-bold text-white -mb-1'>
              <span>{secondaryLabel}</span>
            </p>
            <p className='text-2xl font-bold text-white truncate'>{secondaryText}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopRotator
