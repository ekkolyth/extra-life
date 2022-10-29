import { useQuery } from 'react-query'
import { fetchStats, formatter } from '../../utils/donorDrive'

const Donations = () => {
  const rotationInterval = 10000
  const { data: stats } = useQuery(['extralife', 'donors'], () => fetchStats('478888'), {
    refetchInterval: rotationInterval
  })
  return (
    <div style={{ width: 1920, height: 1080 }} className='bg-grid-pattern relative'>
      <div className='absolute inset-0 flex items-center justify-center'>
        <h1 className='text-10xl font-bold font-display text-white'>{formatter.format(stats?.sumDonations)}</h1>
      </div>
      <div className='w-full h-full bg-[#5D41DE] mix-blend-color'></div>
    </div>
  )
}

export default Donations
