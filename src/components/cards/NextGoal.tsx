import { FlagIcon } from '@heroicons/react/24/outline'
import Card from '../layout/Card'

import GoalsData from '../../data/goals.json'
import { useQuery } from 'react-query'
import { fetchStats } from '../../utils/donorDrive'

const NextGoal = () => {
  const { data: stats } = useQuery(['extralife', 'donors'], () => fetchStats('478888'), {
    refetchInterval: 5000
  })
  const nextGoal = GoalsData.find(goal => goal.value > stats?.sumDonations * 100)

  return (
    <Card title='Next Goal' icon={<FlagIcon />}>
      <div className='flex items-center justify-center pt-4 pb-2'>
        <p className='text-2xl font-bold text-purple-bar-1'>{nextGoal?.name}</p>
      </div>
    </Card>
  )
}

export default NextGoal
