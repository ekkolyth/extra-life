import { Goals } from 'src/components/cards/goals'
import { NextGoal } from 'src/components/cards/next-goal'
import { TopDonor } from 'src/components/cards/top-donor'
import { TotalRaised } from 'src/components/cards/total-raised'
import { QuickResources } from 'src/components/cards/quick-resources'
import { LatestDonations } from 'src/components/cards/latest-donations'
import { fetchLatestDonations, fetchStats, fetchTopDonor } from '@/utils/donor-drive'

export default async function AdminPage() {
  const id = process.env.NEXT_PUBLIC_DONORDRIVE_ID
  if (id === undefined) {
    return <div>DonorDrive ID not set</div>
  }

  const statsData = fetchStats(id)
  const donationsData = fetchLatestDonations(id, 10)
  const topDonorData = fetchTopDonor(id)

  const [stats, donations, topDonor] = await Promise.all([statsData, donationsData, topDonorData])

  return (
    <div className='grid grid-cols-3 gap-4'>
      <div className='flex flex-col gap-y-4'>
        <TotalRaised data={stats} />
        <QuickResources />
      </div>
      <div className='flex flex-col gap-y-4'>
        <TopDonor data={topDonor} />
        <LatestDonations data={donations} />
      </div>
      <div className='flex flex-col gap-y-4'>
        <NextGoal data={stats} />
        <Goals data={stats} />
      </div>
      <div className='flex flex-col gap-y-4'></div>
    </div>
  )
}
