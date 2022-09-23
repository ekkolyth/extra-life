import { BanknotesIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import Image from 'next/image'
import { useQuery } from 'react-query'
import Card from '../layout/Card'

const fetchTopDonor = async (id: string) => {
  return await axios
    .get(
      `https://extra-life.org/api/participants/${id}/donors?limit=1&orderBy=sumDonations%20DESC&where=amountVisibility%20%3D%20ALL%20AND%20sumDonations%20%3E%200`
    )
    .then(res => res.data[0])
}

const TopDonor = () => {
  const { data, error, isLoading } = useQuery(['extralife', 'topDonor'], () => fetchTopDonor('478888'))
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })

  if (isLoading)
    return (
      <Card title='Top Donor' icon={<BanknotesIcon />}>
        Loading...
      </Card>
    )
  if (error)
    return (
      <Card title='Top Donor' icon={<BanknotesIcon />}>
        Error
      </Card>
    )

  return (
    <Card title='Top Donor' icon={<BanknotesIcon />}>
      <div className='my-4 flex items-center'>
        <div className='mr-2 flex items-center'>
          <Image height={64} width={64} alt='Top Donor' src={data.avatarImageURL} />
        </div>
        <div className='w-full flex justify-between items-center'>
          <div>
            <p className='font-semibold text-neutral-800'>{data?.displayName}</p>
            <p className='text-xs text-neutral-500'>{data?.numDonations} donations</p>
          </div>
          <p className='font-semibold text-neutral-800'>{formatter.format(data?.sumDonations)}</p>
        </div>
      </div>
    </Card>
  )
}

export default TopDonor
