import { ChevronRightIcon, CurrencyDollarIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import Image from 'next/image'
import { useQuery } from 'react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useState } from 'react'
import Card from '../layout/Card'
import { toast } from 'react-toastify'
dayjs.extend(relativeTime)

const fetchLatestDonations = async (id: string, limit: number) => {
  return await axios.get(`https://extra-life.org/api/participants/${id}/donations?limit=${limit}`).then(res => res.data)
}

const LatestDonations = () => {
  const [limit, setLimit] = useState(6)
  const { data, error, isLoading } = useQuery(['extralife', 'latestDonations', limit], () =>
    fetchLatestDonations('478888', limit)
  )
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
      <h3 className='mt-4 mb-2 font-bold'>Display Limit</h3>
      <div className='w-full flex items-center'>
        <button
          onClick={() =>
            limit > 2
              ? setLimit(prev => prev - 2)
              : toast.error('You cannot go lower than 2 donations!', {
                  autoClose: false
                })
          }>
          <MinusIcon className='w-8 h-8 rounded-full p-1 bg-el-dark-blue text-white' />
        </button>
        <p className='text-xl mx-4 font-bold'>{limit}</p>
        <button onClick={() => setLimit(prev => prev + 2)}>
          <PlusIcon className='w-8 h-8 rounded-full p-1 bg-el-dark-blue text-white' />
        </button>
      </div>
      <ol className='my-4 flex flex-col divide-y divide-gray-200'>
        {data.map(
          (d: {
            donationID: string
            avatarImageURL: string
            displayName: string
            message: string | null
            amount: number
            createdDateUTC: string
          }) => (
            <li key={d.donationID} className='flex flex-wrap py-3'>
              <div className='mr-2 flex items-center'>
                <Image height={32} width={32} alt='Top Donor' className='rounded-full' src={d.avatarImageURL} />
              </div>
              <div className='flex flex-grow justify-between items-center'>
                <div>
                  <p className='font-semibold text-gray-800'>{d.displayName}</p>
                  <p className='text-xs -mt-1 text-gray-500'>{dayjs(d.createdDateUTC).fromNow()}</p>
                </div>
                <p className='font-semibold text-gray-800'>{formatter.format(d.amount)}</p>
              </div>
              <div className='w-full mt-2'>
                <p className='text-xs text-gray-800'>{d.message ?? 'No message supplied'}</p>
              </div>
            </li>
          )
        )}
      </ol>
      <footer className='flex justify-end'>
        <a
          href='https://www.extra-life.org/index.cfm?fuseaction=portal.donations'
          target='_blank'
          rel='noreferrer'
          className='flex items-center text-sm font-semibold uppercase text-el-dark-blue'>
          Go to Extra Life Donations Page <ChevronRightIcon className='w-4 h-4' />
        </a>
      </footer>
    </Card>
  )
}

export default LatestDonations
