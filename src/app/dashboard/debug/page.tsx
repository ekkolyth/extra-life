import { DonationTrigger } from '@/components/debug/donation'
import { Redemptions } from '@/components/debug/redemptions'
import { db } from '@/lib/convex'

export default async function DebugPage() {
  const randomizers = await db.randomizer.findMany()

  return (
    <div className='space-y-8'>
      <DonationTrigger />
      <Redemptions randomizers={randomizers} />
    </div>
  )
}
