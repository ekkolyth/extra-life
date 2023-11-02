'use client'

import { FerrisWheelIcon } from 'lucide-react'
import Card from './card'
import { Randomizer } from '@prisma/client'
import Link from 'next/link'
import { useChannel } from 'ably/react'
import { Button } from '@/components/ui/button'
import { AblyMessage } from '@/types'

interface RandomizerCardProps {
  randomizers: Randomizer[]
}

export function RandomizerCard(props: RandomizerCardProps) {
  const { randomizers } = props

  const { channel } = useChannel('randomizers', (message: AblyMessage) => {
    switch (message.name) {
      case 'randomizer':
        console.log(message.data)
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
      default:
        console.log('Unknown message type:', message)
    }
  })

  return (
    <Card title='Randomizers' icon={<FerrisWheelIcon />}>
      <p className='text-destructive font-bold text-xs -mt-6 mb-4'>
        Do not close this page once a randomizer is triggered, until it is finished spinning.
      </p>
      <ul>
        {randomizers.length > 0 ? (
          randomizers.map(randomizer => (
            <li key={randomizer.id} className='flex justify-between items-center'>
              <p>{randomizer.name}</p>
              <Button
                variant='link'
                onClick={() =>
                  channel.publish({
                    name: 'randomizer',
                    data: randomizer.id
                  })
                }>
                Trigger
              </Button>
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
