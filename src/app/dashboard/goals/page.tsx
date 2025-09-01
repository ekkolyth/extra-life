import { DataTable } from '@/components/data-table'
import { columns } from './columns'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { GoalForm } from '@/forms/goal'
import { Button } from '@/components/ui/button'
import { getGoals } from '@/actions/goals'

export default async function GoalsPage() {
  const goalsData = getGoals()

  const [goals] = await Promise.all([goalsData])

  return (
    <div className='flex flex-col gap-4'>
      <Dialog>
        <DialogTrigger asChild>
          <Button className='self-end'>Create Goal</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Goal</DialogTitle>
          </DialogHeader>
          <GoalForm />
        </DialogContent>
      </Dialog>
      <DataTable columns={columns} data={goals} />
    </div>
  )
}
