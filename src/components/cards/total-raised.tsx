'use client'

import { ChartPieIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { StatsResult, fetchStats, formatter, percentage } from '@/utils/donor-drive'
import Card from './card'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useQuery } from 'react-query'

interface TotalRaisedProps {
  data: StatsResult
}

export const TotalRaised = (props: TotalRaisedProps) => {
  const { data: stats } = props

  const id = String(process.env.NEXT_PUBLIC_DONORDRIVE_ID)
  const { data } = useQuery('goals', () => fetchStats(id), {
    initialData: stats,
    enabled: !!id,
    refetchInterval: 15000
  })

  if (data === undefined) {
    return null
  }

  const calculatedPercentage = percentage(data?.sumDonations, data?.fundraisingGoal)

  return (
    <Card title='Total Raised YTD' icon={<ChartPieIcon />}>
      <div className='flex flex-col items-center justify-center gap-2'>
        <p className='text-4xl'>{formatter.format(data?.sumDonations)}</p>
        <div className='relative w-full'>
          <Progress className='h-6 w-full' title={`${calculatedPercentage}%`} value={calculatedPercentage} />
          <p className='absolute inset-0 text-center'>{calculatedPercentage}%</p>
        </div>
      </div>
      <div className='mt-4 -mx-6'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stat</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Fundraising Goal</TableCell>
              <TableCell>{formatter.format(data?.fundraisingGoal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Num Donations</TableCell>
              <TableCell>{data?.numDonations}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Num Incentives</TableCell>
              <TableCell>{data?.numIncentives}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Num Milestones</TableCell>
              <TableCell>{data?.numMilestones}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Event ID</TableCell>
              <TableCell>{data?.eventID}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <Button className='w-full' variant='link' asChild>
        <Link href={data?.links.page} target='_blank' rel='noreferrer'>
          Go to Extra Life Profile <ChevronRightIcon className='w-4 h-4' />
        </Link>
      </Button>
    </Card>
  )
}
