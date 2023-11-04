import { prisma } from '@/lib/prisma'

export async function GET(request: Request, context: { params: any }) {
  const id = context.params.id

  const data = await prisma.wheelRedemption.findMany({
    where: {
      randomizer: {
        id
      }
    },
    include: {
      randomizer: true
    }
  })

  return Response.json(data)
}

export async function DELETE(request: Request, context: { params: any }) {
  const id = context.params.id

  const data = await prisma.wheelRedemption.deleteMany({})

  return Response.json(data)
}
