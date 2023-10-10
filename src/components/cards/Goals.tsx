'use client'

import { ChartBarIcon } from '@heroicons/react/24/outline'
import { CheckBadgeIcon, ClockIcon } from '@heroicons/react/24/solid'
import Card from './card'
import { formatter } from '../../utils/donor-drive'

import GoalsData from '../../data/goals.json'
import { useQuery } from 'react-query'
import { fetchStats } from '../../utils/donor-drive'

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export const Goals = () => {
  const { data: stats } = useQuery(
    ['extralife', 'donors'],
    () => fetchStats(String(process.env.NEXT_PUBLIC_DONORDRIVE_ID)),
    {
      refetchInterval: 5000
    }
  )
  const nextGoalIndex = GoalsData.findIndex(goal => goal.value > stats?.sumDonations * 100)
  const nextGoal = GoalsData[nextGoalIndex]

  return (
    <Card title='Goals' icon={<ChartBarIcon />}>
      <div className='mt-4 -mx-6'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <span className='sr-only'>Status</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {GoalsData.map((goal, index) => (
              <TableRow key={goal.id}>
                <TableCell>
                  {nextGoalIndex > index ? (
                    <CheckBadgeIcon className='w-4 h-4 text-green-600' />
                  ) : (
                    <ClockIcon className='w-4 h-4 text-gray-400' />
                  )}
                </TableCell>
                <TableCell>
                  <p className='text-sm'>{goal.name}</p>
                  <p className='text-primary text-xs font-semibold'>{goal.note}</p>
                </TableCell>
                <TableCell>{formatter.format(goal.value / 100)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
