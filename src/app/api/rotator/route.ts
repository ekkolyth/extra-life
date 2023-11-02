import { prisma } from '@/lib/prisma'

export async function GET() {
  const rotators = await prisma.rotator.findMany({})

  return Response.json(rotators)
}
