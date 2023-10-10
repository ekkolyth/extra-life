'use client'

import { ChevronRightIcon, CurrencyDollarIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import { useQuery } from 'react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import Card from './card'
import { toast } from 'react-toastify'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { fetchLatestDonations } from '../../utils/donor-drive'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import { Button } from '../ui/button'
import Link from 'next/link'

dayjs.extend(relativeTime)

export const LatestDonations = () => {
  const [limit, setLimit] = useState(6)
  const { data, error, isLoading } = useQuery(['extralife', 'latestDonations', limit], () =>
    fetchLatestDonations(String(process.env.NEXT_PUBLIC_DONORDRIVE_ID), limit)
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
      <div className='absolute top-6 right-5'>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline' size='icon'>
              <span className='sr-only'>Open</span>
              <EllipsisHorizontalIcon className='w-5 h-5' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[180px] flex flex-col items-center justify-center'>
            <p>Visible Donations</p>
            <div className='p-2 flex items-center'>
              <button
                type='button'
                onClick={() =>
                  limit > 2
                    ? setLimit(prev => prev - 2)
                    : toast.error('You cannot go lower than 2 donations!', {
                        autoClose: false
                      })
                }>
                <MinusIcon className='w-8 h-8 rounded-full p-1' />
              </button>
              <p className='text-xl mx-4 font-bold'>{limit}</p>
              <button type='button' onClick={() => setLimit(prev => prev + 2)}>
                <PlusIcon className='w-8 h-8 rounded-full p-1' />
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <ol className='my-4 flex flex-col divide-y divide-border'>
        {data &&
          data?.map(d => (
            <li key={d.donationID} className='flex flex-wrap py-3'>
              <div className='mr-2 flex items-center'>
                <Image height={32} width={32} alt='Top Donor' className='rounded-full' src={d.avatarImageURL} />
              </div>
              <div className='flex flex-grow justify-between items-center'>
                <div>
                  <p className='font-semibold'>{d.displayName}</p>
                  <p className='text-xs -mt-1 text-primary'>{dayjs(d.createdDateUTC).fromNow()}</p>
                </div>
                <p className='font-semibold'>{formatter.format(d.amount)}</p>
              </div>
              <div className='w-full mt-2'>{d.message && <p className='text-xs'>{d.message}</p>}</div>
            </li>
          ))}
      </ol>
      <Button variant='link' className='w-full' asChild>
        <Link href='https://www.extra-life.org/index.cfm?fuseaction=portal.donations' target='_blank' rel='noreferrer'>
          Go to Extra Life Donations Page <ChevronRightIcon className='w-4 h-4' />
        </Link>
      </Button>
    </Card>
  )
}
