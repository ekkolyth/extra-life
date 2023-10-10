import { Goals } from '@/components/cards/goals'
import { LatestDonations } from '@/components/cards/latest-donations'
import { NextGoal } from '@/components/cards/next-goal'
import { QuickResources } from '@/components/cards/quick-resources'
import { TopDonor } from '@/components/cards/top-donor'
import { TotalRaised } from '@/components/cards/total-raised'
import { WheelSpins } from '@/components/overlay/wheel-spins'

export default function AdminPage() {
  return (
    <div className='grid grid-cols-3 gap-4'>
      <div className='flex flex-col gap-y-4'>
        <TotalRaised />
        <QuickResources />
      </div>
      <div className='flex flex-col gap-y-4'>
        <TopDonor />
        <NextGoal />
        <Goals />
      </div>
      <div className='flex flex-col gap-y-4'>
        <WheelSpins visible={false} />
        <LatestDonations />
      </div>
    </div>
  )
}
