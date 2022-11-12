import { BanknotesIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import { useQuery } from 'react-query'
import { fetchTopDonor } from '../../utils/donorDrive'
import Card from '../layout/Card'

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
          {data?.avatarImageURL && <Image height={64} width={64} alt='Top Donor' src={data.avatarImageURL} />}
        </div>
        <div className='w-full flex justify-between items-center'>
          <div>
            <p className='font-semibold text-gray-800'>{data?.displayName}</p>
            <p className='text-xs text-gray-500'>{data?.numDonations} donations</p>
          </div>
          <p className='font-semibold text-gray-800'>{formatter.format(data?.sumDonations ?? 0)}</p>
        </div>
      </div>
    </Card>
  )
}

export default TopDonor
