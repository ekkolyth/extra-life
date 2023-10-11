'use client'

import { ChartBarIcon } from '@heroicons/react/24/outline'
import { CheckBadgeIcon, ClockIcon } from '@heroicons/react/24/solid'

import Card from './card'
import GoalsData from '@/data/goals.json'
import { StatsResult, fetchStats, formatter } from '@/utils/donor-drive'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'src/components/ui/table'
import { useQuery } from 'react-query'

interface GoalsProps {
  data: StatsResult
}

export const Goals = (props: GoalsProps) => {
  const { data: stats } = props

  const id = String(process.env.NEXT_PUBLIC_DONORDRIVE_ID)
  const { data } = useQuery('stats', () => fetchStats(id), {
    initialData: stats,
    enabled: !!id,
    refetchInterval: 15000
  })

  const nextGoalIndex = data?.sumDonations ? GoalsData.findIndex(goal => goal.value > data.sumDonations * 100) : 0
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
