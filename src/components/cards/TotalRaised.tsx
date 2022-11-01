import { ChartPieIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { fetchStats, formatter, percentage } from '../../utils/donorDrive'
import { useQuery } from 'react-query'
import { classNames } from '../../utils/style'
import Card from '../layout/Card'


const TotalRaised = () => {
  const { data, error, isLoading } = useQuery(['extralife', 'donors'], () => fetchStats('478888'))
	const calculatedPercentage = percentage(data?.sumDonations, data?.fundraisingGoal)

  if (isLoading)
    return (
      <Card title='Total Raised YTD' icon={<ChartPieIcon />}>
        Loading...
      </Card>
    )
  if (error)
    return (
      <Card title='Total Raised YTD' icon={<ChartPieIcon />}>
        Error
      </Card>
    )

  return (
    <Card title='Total Raised YTD' icon={<ChartPieIcon />}>
      <div className='flex items-center justify-center my-4'>
        <div
          className={classNames(
            calculatedPercentage >= 100
              ? 'text-green-700 border-green-50 bg-green-100'
              : 'text-el-dark-blue border-blue-50 bg-blue-50',
            'radial-progress border-4'
          )}
          /* @ts-ignore */
          style={{ '--value': calculatedPercentage, '--size': '8rem' }}>
          {formatter.format(data?.sumDonations)}
        </div>
      </div>
      <div className='overflow-hidden border rounded-lg my-6'>
        <table className='table table-compact w-full'>
          <thead>
            <tr>
              <th>Stat</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Fundraising Goal</td>
              <td>{formatter.format(data?.fundraisingGoal)}</td>
            </tr>
            <tr>
              <td>Num Donations</td>
              <td>{data?.numDonations}</td>
            </tr>
            <tr>
              <td>Num Incentives</td>
              <td>{data?.numIncentives}</td>
            </tr>
            <tr>
              <td>Num Milestones</td>
              <td>{data?.numMilestones}</td>
            </tr>
            <tr>
              <td>Event ID</td>
              <td>{data?.eventID}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <footer className='flex justify-end'>
        <a
          href={data.links?.page}
          target='_blank'
          rel='noreferrer'
          className='flex items-center text-sm font-semibold uppercase text-el-dark-blue'>
          Go to Extra Life Profile <ChevronRightIcon className='w-4 h-4' />
        </a>
      </footer>
    </Card>
  )
}

export default TotalRaised
