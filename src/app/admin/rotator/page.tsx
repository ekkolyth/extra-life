import { RotatorForm } from '@/forms/rotator'
import { prisma } from '@/lib/prisma'

export default async function RotatorPage() {
  const data = await prisma.rotator.findMany()

  return <RotatorForm items={data} />
}
