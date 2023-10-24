import { getRandomizers } from '@/actions/randomizer'
import { RandomizerForm } from '@/forms/randomizer'

export default async function RandomizerPage() {
  const randomizersData = getRandomizers()

  const [randomizers] = await Promise.all([randomizersData])

  console.log(randomizers)

  return <RandomizerForm />
}
