import { useState } from 'react'
import { useQuery } from 'react-query'
import { fetchWheelSpinDonations } from '../../utils/donorDrive'
import { trpc } from '../../utils/trpc'

const WheelSpins = ({ visible }: { visible: boolean }) => {
  trpc.useQuery(['wheelSpins.getAll'], {
    refetchInterval: 5000,
    onSuccess(data) {
      setLeft(total - data)
    }
  })
  useQuery(['extralife', 'wheelSpinDonations'], () => fetchWheelSpinDonations('478888'), {
    onSuccess(data) {
      setTotal(data.length)
    }
  })
  // Any donation over 20.22 and under 99.99 counts as 1 spin
  const [left, setLeft] = useState(0)
  const [total, setTotal] = useState(0)

  return (
    <div className={visible ? '' : 'hidden'}>
      <p className='font-bold text-3xl text-white mb-2'>wheel spins</p>
      <p className='font-bold text-4xl text-white'>
        {left} / {total}
      </p>
    </div>
  )
}

export default WheelSpins
