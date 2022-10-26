import { useQuery } from 'react-query'
import { fetchWheelSpinDonations } from '../../utils/donorDrive'

const WheelSpins = () => {
  const { data } = useQuery(['extralife', 'wheelSpinDonations'], () => fetchWheelSpinDonations('478888'))

  return (
    <div className='bg-purple-bar-1 w-72 rounded-xl py-4 px-6 shadow-super'>
      <p className='font-bold text-3xl text-white mb-2'>wheel spins</p>
      <p className='font-bold text-4xl text-white'>
        {0} / {data?.length}
      </p>
    </div>
  )
}

export default WheelSpins
