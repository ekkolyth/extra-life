import { Goals } from 'tmp/components/cards/goals'
import { LatestDonations } from 'tmp/components/cards/latest-donations'
import { NextGoal } from 'tmp/components/cards/next-goal'
import { QuickResources } from 'tmp/components/cards/quick-resources'
import { TopDonor } from 'tmp/components/cards/top-donor'
import { TotalRaised } from 'tmp/components/cards/total-raised'
import { WheelSpins } from 'tmp/components/overlay/wheel-spins'

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
