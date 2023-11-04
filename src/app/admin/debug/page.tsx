import { DonationTrigger } from '@/components/debug/donation'
import { Redemptions } from '@/components/debug/redemptions'
import { prisma } from '@/lib/prisma'

export default async function DebugPage() {
  const randomizers = await prisma.randomizer.findMany()

  return (
    <div className='space-y-8'>
      <DonationTrigger />
      <Redemptions randomizers={randomizers} />
    </div>
  )
}
