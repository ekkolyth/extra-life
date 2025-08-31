'use client'

import type { Randomizer } from '@/types/db'

import { Button } from '../ui/button'

interface RedemptionsProps {
  randomizers: Randomizer[]
}

export function Redemptions(props: RedemptionsProps) {
  const { randomizers } = props

  return (
    <section className='space-y-4'>
      <h2 className='text-lg font-semibold'>Donation Trigger</h2>
      <div className='flex gap-4'>
        {randomizers.map(randomizer => (
          <Button
            key={randomizer.id}
            onClick={() => {
              fetch(`/api/randomizers/${randomizer.id}/redemptions`, {
                method: 'DELETE'
              })
            }}>
            Delete {randomizer.name} Redemptions
          </Button>
        ))}
      </div>
    </section>
  )
}
