'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Randomizer } from '@prisma/client'
import { FerrisWheelIcon } from 'lucide-react'

import Card from './card'
import * as Ably from 'ably'
import { ably } from '@/lib/ably'
import { Button } from '@/components/ui/button'
import { useQuery } from 'react-query'
import { fetchWheelSpinDonations } from '@/utils/donor-drive'

interface RandomizerCardProps {
  randomizers: Randomizer[]
}

export function RandomizerCard(props: RandomizerCardProps) {
  const { randomizers } = props
  const [left, setLeft] = useState(0)
  const [total, setTotal] = useState(0)
  const [channel, setChannel] = useState<Ably.Types.RealtimeChannelPromise | null>(ably.channels.get('randomizers'))

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

  useEffect(() => {
    if (channel) {
      channel.subscribe((message: Ably.Types.Message) => {
        switch (message.name) {
          case 'randomizer-end':
            console.log('randomizer-end', message.data)
            fetch(`/api/randomizers/items`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                id: message.data.answer.id
              })
            })
            break
          case 'randomizer-start':
            console.log('randomizer-start', message.data)
            break
          default:
            console.log('Unknown message type:', message)
        }
      })
    }
  }, [channel])

  return (
    <Card title='Randomizers' icon={<FerrisWheelIcon />}>
      <p className='text-destructive font-bold text-xs -mt-6 mb-4'>
        Do not close this page once a randomizer is triggered, until it is finished spinning.
      </p>
      <div>
        <h3>Spins</h3>
        <p className='font-bold text-4xl text-white'>
          {left} / {total}
        </p>
      </div>
      <ul>
        {randomizers.length > 0 ? (
          randomizers.map(randomizer => (
            <li key={randomizer.id} className='flex justify-between items-center'>
              <p>{randomizer.name}</p>
              {channel && (
                <Button
                  variant='link'
                  onClick={() =>
                    channel.publish({
                      name: 'randomizer-start',
                      data: randomizer.id
                    })
                  }>
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
