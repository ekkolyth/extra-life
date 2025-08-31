import { db } from '@/lib/convex'

export async function GET(request: Request, context: { params: any }) {
  const id = context.params.id

  const data = await db.wheelRedemption.findMany({
    where: { randomizerId: id }
  })

  return Response.json(data)
}

export async function DELETE(request: Request, context: { params: any }) {
  const id = context.params.id

  const data = await db.wheelRedemption.deleteMany({ where: { randomizerId: id } })

  return Response.json(data)
}
