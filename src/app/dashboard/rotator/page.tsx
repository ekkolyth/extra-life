import { RotatorForm } from '@/forms/rotator'
import { db } from '@/lib/convex'

export default async function RotatorPage() {
  const data = await db.rotator.findMany()

  return <RotatorForm items={data} />
}
