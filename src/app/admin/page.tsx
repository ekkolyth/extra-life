import { Goals } from 'src/components/cards/goals'
import { LatestDonations } from 'src/components/cards/latest-donations'
import { NextGoal } from 'src/components/cards/next-goal'
import { QuickResources } from 'src/components/cards/quick-resources'
import { TopDonor } from 'src/components/cards/top-donor'
import { TotalRaised } from 'src/components/cards/total-raised'
import { WheelSpins } from 'src/components/overlay/wheel-spins'

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
