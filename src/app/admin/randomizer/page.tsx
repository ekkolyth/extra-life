import { getRandomizers } from '@/actions/randomizer'
import { RandomizerForm } from '@/forms/randomizer'

export default async function RandomizerPage() {
  const randomizersData = getRandomizers()

  const [randomizers] = await Promise.all([randomizersData])

  return (
    <div className='space-y-6'>
      {randomizers.map(randomizer => (
        <RandomizerForm key={randomizer.id} randomizer={randomizer} />
      ))}
      <RandomizerForm />
    </div>
  )
}
