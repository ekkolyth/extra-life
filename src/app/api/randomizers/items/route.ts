import { prisma } from '@/lib/prisma'

export async function PUT(request: Request) {
  const { id } = await request.json()

  const data = await prisma.randomizerItem.update({
    where: { id },
    data: {
      redeemed: {
        increment: 1
      }
    }
  })

  await prisma.wheelRedemption.create({
    data: {
      randomizer: {
        connect: {
          id: data.randomizerId
        }
      }
    }
  })

  return Response.json(data)
}
