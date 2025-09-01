import { getRandomizers } from '@/actions/randomizer';
import { RandomizerForm } from '@/forms/randomizer';
import type { Randomizer } from '@/types/db';

export const dynamic = 'force-dynamic';

export default async function RandomizerPage() {
  const randomizersData = getRandomizers()

  const [randomizers] = await Promise.all([randomizersData])

  return (
    <div className='space-y-6'>
      {randomizers.map((randomizer: Randomizer) => (
        <RandomizerForm key={randomizer.id} randomizer={randomizer} />
      ))}
      <RandomizerForm />
    </div>
  )
}
