'use client'

import { FlagIcon } from '@heroicons/react/24/outline'
import Card from '../layout/card'

import GoalsData from '../../data/goals.json'
import { useQuery } from 'react-query'
import { fetchStats } from '../../utils/donor-drive'

export const NextGoal = () => {
  const { data: stats } = useQuery(
    ['extralife', 'donors'],
    () => fetchStats(String(process.env.NEXT_PUBLIC_DONORDRIVE_ID)),
    {
      refetchInterval: 5000
    }
  )
  const nextGoal = GoalsData.find(goal => goal.value > stats?.sumDonations * 100)

  return (
    <Card title='Next Goal' icon={<FlagIcon />}>
      <p className='text-3xl font-bold text-primary text-center'>{nextGoal?.name}</p>
    </Card>
  )
}
