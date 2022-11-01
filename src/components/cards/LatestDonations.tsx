import { CurrencyDollarIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import Image from 'next/image'
import { useQuery } from 'react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Card from '../layout/Card'
dayjs.extend(relativeTime)

const fetchLatestDonations = async (id: string) => {
  return await axios.get(`https://extra-life.org/api/participants/${id}/donations?limit=8`).then(res => res.data)
}

const LatestDonations = () => {
  const { data, error, isLoading } = useQuery(['extralife', 'latestDonations'], () => fetchLatestDonations('478888'))
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })

  if (isLoading)
    return (
      <Card title='Latest Donations' icon={<CurrencyDollarIcon />}>
        Loading...
      </Card>
    )
  if (error)
    return (
      <Card title='Latest Donations' icon={<CurrencyDollarIcon />}>
        Error
      </Card>
    )

  return (
    <Card title='Latest Donations' icon={<CurrencyDollarIcon />}>
      <ol className='my-4 flex flex-col divide-y divide-neutral-200'>
        {data.map(
          (d: {
            donationID: string
            avatarImageURL: string
            displayName: string
            message: string | null
            amount: number
            createdDateUTC: string
          }) => (
            <li key={d.donationID} className='flex py-3'>
              <div className='mr-2 flex items-center'>
                <Image height={32} width={32} alt='Top Donor' className='rounded-full' src={d.avatarImageURL} />
              </div>
              <div className='w-full flex justify-between items-center'>
                <div>
                  <div className='flex items-baseline'>
                    <p className='font-semibold text-neutral-800'>{d.displayName}</p>
                    <p className='ml-2 text-xs text-neutral-500'>{dayjs(d.createdDateUTC).fromNow()}</p>
                  </div>
                  <p className='text-xs text-neutral-800'>{d.message ?? 'No message supplied'}</p>
                </div>
                <p className='font-semibold text-neutral-800'>{formatter.format(d.amount)}</p>
              </div>
            </li>
          )
        )}
      </ol>
    </Card>
  )
}

export default LatestDonations
