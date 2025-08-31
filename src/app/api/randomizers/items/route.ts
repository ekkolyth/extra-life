import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/convex'

export async function PUT(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { id } = await request.json()

  const data = await db.randomizerItem.update({
    where: { id },
    data: {
      redeemed: {
        increment: 1
      }
    }
  })

  await db.wheelRedemption.create({
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
