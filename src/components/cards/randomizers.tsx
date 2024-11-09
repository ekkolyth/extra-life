'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Randomizer, RandomizerItem } from '@prisma/client'
import { FerrisWheelIcon } from 'lucide-react'

import Card from './card'
import * as Ably from 'ably'
import { ably } from '@/lib/ably'
import { Button } from '@/components/ui/button'
import { useQuery } from 'react-query'
import { fetchWheelSpinDonations } from '@/utils/donor-drive'

interface RandomizerWithItems extends Randomizer {
  items: RandomizerItem[]
}

interface RandomizerCardProps {
  randomizers: RandomizerWithItems[]
}

export function RandomizerCard(props: RandomizerCardProps) {
  const { randomizers } = props
  const [left, setLeft] = useState(0)
  const [total, setTotal] = useState(0)
  const [channel] = useState<Ably.Types.RealtimeChannelPromise | null>(ably.channels.get('randomizers'))

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
  useQuery(
    ['redemptions'],
    () => fetch(`/api/randomizers/cloglmz700000lc08agvmotp1/redemptions`).then(res => res.json()),
    {
      cacheTime: 0,
      refetchInterval: 5000,
      onSuccess(data) {
        console.log('redemptions', data)
        setLeft(total - data.length)
      }
    }
  )

  function handleWheelSpin(id: string) {
    // Get options for the given wheel
    const items = randomizers.find(randomizer => randomizer.id === id)?.items

    // Pick one at random that has available redemptions
    const availableItems = items?.filter(item => item.redeemed < item.limit)
    const winner = availableItems?.[Math.floor(Math.random() * availableItems.length)]

    if (!winner) {
      console.error('No winner found')
      return
    }

    // Redeem the item on the backend
    fetch(`/api/randomizers/items`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: winner.id
      })
    })

    // Publish the winner
    channel?.publish({
      name: 'wheel-spin',
      data: {
        id,
        answer: winner,
        randomizer: randomizers.find(randomizer => randomizer.id === id)
      }
    })
  }

  return (
    <Card title='Randomizers' icon={<FerrisWheelIcon />}>
      <p className='text-destructive font-bold text-xs -mt-6 mb-4'>
        Do not close this page once a randomizer is triggered, until it is finished spinning.
      </p>
      <div className='flex flex-col items-start'>
        <h3>Spins</h3>
        <div className='grid grid-cols-3 items-center justify-center'>
          <p className='font-bold text-4xl text-white'>{left}</p>
          <p className='px-2 text-xl'>/</p>
          <p className='font-bold text-4xl text-white'>{total}</p>
          <p className='text-xs text-muted-foreground'>Left</p>
          <p></p>
          <p className='text-xs text-muted-foreground'>Total</p>
        </div>
      </div>
      <ul>
        {randomizers.length > 0 ? (
          randomizers.map(randomizer => (
            <li key={randomizer.id} className='flex justify-between items-center'>
              <p>{randomizer.name}</p>
              {channel && (
                <Button
                  // disabled={left === 0}
                  variant='link'
                  onClick={() => {
                    handleWheelSpin(randomizer.id)
                    // channel.publish({
                    //   name: 'randomizer-start',
                    //   data: randomizer.id
                    // })
                  }}>
                  Trigger
                </Button>
              )}
            </li>
          ))
        ) : (
          <li className='flex justify-between items-center'>
            <p>No randomizers found</p>
            <Button variant='link' asChild>
              <Link href='/admin/randomizer'>Add one</Link>
            </Button>
          </li>
        )}
      </ul>
    </Card>
  )
}
