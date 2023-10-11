'use client'

import { FlagIcon } from '@heroicons/react/24/outline'
import Card from './card'

import GoalsData from '@/data/goals.json'
import { StatsResult, fetchStats } from '@/utils/donor-drive'
import { useQuery } from 'react-query'

interface NextGoalProps {
  data: StatsResult
}

export const NextGoal = (props: NextGoalProps) => {
  const { data: stats } = props

  const id = String(process.env.NEXT_PUBLIC_DONORDRIVE_ID)
  const { data } = useQuery('stats', () => fetchStats(id), {
    initialData: stats,
    enabled: !!id,
    refetchInterval: 15000
  })

  if (data === undefined) {
    return null
  }

  const nextGoal = GoalsData.find(goal => goal.value > data?.sumDonations * 100)

  return (
    <Card title='Next Goal' icon={<FlagIcon />}>
      <p className='text-3xl font-bold text-primary text-center'>{nextGoal?.name}</p>
    </Card>
  )
}
