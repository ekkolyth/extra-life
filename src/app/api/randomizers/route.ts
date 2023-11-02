import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const data = await prisma.randomizer
    .findMany({
      include: {
        items: true
      }
    })
    .then(r =>
      r.map(r => ({
        ...r,
        items: r.items.filter(i => i.limit > i.redeemed)
      }))
    )

  return Response.json(data)
}
