'use client'

import type { Goal, Segment } from '@prisma/client'

import { useQuery } from 'react-query'
import { useEffect, useState } from 'react'

import { useSegments } from '@/utils/useSegments'
import { fetchStats, fetchTopDonation, fetchTopDonor } from '@/utils/donor-drive'

interface TopRotatorProps {
  goals: Goal[]
}

export function RightText(props: TopRotatorProps) {
  const { goals } = props
  const [index, setIndex] = useState(0)
  const [text, setText] = useState<{ label: string; text: string }[]>([])

  // Donations
  const { data: topDonation } = useQuery(['topDonation'], () =>
    fetchTopDonation(String(process.env.NEXT_PUBLIC_DONORDRIVE_ID))
  )
  const { data: topDonor } = useQuery(['topDonor'], () => fetchTopDonor(String(process.env.NEXT_PUBLIC_DONORDRIVE_ID)))

  // Goals
  const { data: stats } = useQuery(['donors'], () => fetchStats(String(process.env.NEXT_PUBLIC_DONORDRIVE_ID)), {
    refetchInterval: 5000
  })
  const nextGoal =
    stats && stats !== 'Rate limited' && goals && goals.length
      ? goals?.find(goal => goal.amount > stats.sumDonations)
      : undefined

  // Segments
  const { data: segments } = useQuery(
    ['segments'],
    () => fetch('/api/segments').then(res => res.json()) as Promise<Segment[]>,
    {
      refetchInterval: 5000
    }
  )
  const { currentSegment, nextSegment } = useSegments(segments)

  const bonusText: { label: string; text: string }[] = [
    {
      label: 'right now',
      text: currentSegment?.title ?? ''
    },
    {
      label: 'up next',
      text: nextSegment?.title ?? ''
    },
    {
      label: 'top donation',
      text: topDonation
        ? `${typeof topDonation !== 'string' ? topDonation?.displayName ?? 'Anonymous' : 'Your Mom'} - $${
            typeof topDonation !== 'string' ? topDonation?.amount : '69'
          }`
        : ''
    },
    {
      label: 'top donator',
      text: topDonor ? `${typeof topDonor !== 'string' ? topDonor?.displayName : 'Your Mom'}` : ''
    },
    {
      label: 'next goal unlock',
      text: `${nextGoal?.title}${nextGoal?.endOfStream ? ` - End Of Stream` : ''}`
    }
  ]
  const visibleIndex = index % bonusText.length

  // Every 3 seconds increment the index
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prevIndex => prevIndex + 1)
    }, 7000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className='flex-grow flex justify-end py-1'>
      <div className='text-right'>
        <p className='text-2xl font-bold text-white -mb-1'>{bonusText[visibleIndex].label}</p>
        <p className='text-2xl font-bold text-white truncate'>{bonusText[visibleIndex].text}</p>
      </div>
    </div>
  )
}
