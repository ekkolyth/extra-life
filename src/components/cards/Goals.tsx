import { ChartBarIcon } from '@heroicons/react/24/outline'
import { CheckBadgeIcon, ClockIcon } from '@heroicons/react/24/solid'
import Card from '../layout/Card'
import { formatter } from '../../utils/donorDrive'

import GoalsData from '../../data/goals.json'
import { useQuery } from 'react-query'
import { fetchStats } from '../../utils/donorDrive'

const Goals = () => {
  const { data: stats } = useQuery(['extralife', 'donors'], () => fetchStats('478888'), {
    refetchInterval: 5000
  })
  const nextGoalIndex = GoalsData.findIndex(goal => goal.value > stats?.sumDonations * 100)
  const nextGoal = GoalsData[nextGoalIndex]

  return (
    <Card title='Goals' icon={<ChartBarIcon />}>
      {/* <ol className='text-sm space-y-2 pt-4'>
        {GoalsData.map((goal, index) => (
          <li key={goal.id}>
            <div className='flex items-center'>
              {nextGoalIndex > index ? (
                <span className='mr-2'>
                  <CheckBadgeIcon className='w-4 h-4 text-green-600' />
                </span>
              ) : (
                <span className='mr-2'>
                  <ClockIcon className='w-4 h-4 text-gray-400' />
                </span>
              )}
              <span>
                {goal.name} {formatter.format(goal.value / 100)}
              </span>
            </div>
            {goal.note && <p className='text-gray-900 text-xs font-semibold ml-6'>{goal.note}</p>}
          </li>
        ))}
      </ol> */}
      <div className='overflow-hidden border rounded-lg mt-6'>
        <table className='table table-compact w-full'>
          <thead>
            <tr>
              <th>
                <span className='sr-only'>Status</span>
              </th>
              <th>Name</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {GoalsData.map((goal, index) => (
              <tr key={goal.id} className={nextGoalIndex > index ? '[&_td]:bg-green-200' : ''}>
                <td>
                  {nextGoalIndex > index ? (
                    <CheckBadgeIcon className='w-4 h-4 text-green-600' />
                  ) : (
                    <ClockIcon className='w-4 h-4 text-gray-400' />
                  )}
                </td>
                <td>
                  <p className='text-sm'>{goal.name}</p>
                  <p className='text-gray-900 text-xs font-semibold'>{goal.note}</p>
                </td>
                <td>{formatter.format(goal.value / 100)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default Goals
