'use client'

import { useState } from 'react'
import { useQuery } from 'react-query'
import { fetchWheelSpinDonations } from '../../utils/donor-drive'

export const WheelSpins = ({ visible }: { visible: boolean }) => {
  useQuery(
    ['extralife', 'wheelSpinDonations'],
    () => fetchWheelSpinDonations(String(process.env.NEXT_PUBLIC_DONORDRIVE_ID)),
    {
      refetchInterval: 5000,
      onSuccess(data) {
        setTotal(data.length)
      }
    }
  )
  // Any donation over 20.22 and under 99.99 counts as 1 spin
  const [left, setLeft] = useState(6)
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
