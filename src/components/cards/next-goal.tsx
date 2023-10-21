'use client'

import type { Goal } from '@prisma/client'

import { useQuery } from 'react-query'
import { FlagIcon } from '@heroicons/react/24/outline'

import Card from './card'
import { StatsResult, fetchStats } from '@/utils/donor-drive'

interface NextGoalProps {
  data: StatsResult
  goals: Goal[]
}

export const NextGoal = (props: NextGoalProps) => {
  const { data: stats, goals } = props

  const id = String(process.env.NEXT_PUBLIC_DONORDRIVE_ID)
  const { data } = useQuery('stats', () => fetchStats(id), {
    initialData: stats,
    enabled: !!id,
    refetchInterval: 15000
  })

  if (data === undefined) {
    return null
  }

  const nextGoal = goals.find(goal => goal.amount > data?.sumDonations * 100)

  return (
    <Card title='Next Goal' icon={<FlagIcon />}>
      <p className='text-3xl font-bold text-primary text-center'>{nextGoal?.title}</p>
    </Card>
  )
}
