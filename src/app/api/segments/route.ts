import { getSegments } from '@/actions/segments'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const data = await getSegments()

  return Response.json(data)
}

export async function POST(req: NextRequest) {
  let data = await req.json()

  const segment = await prisma.segment.create({
    data: {
      ...data,
      duration: Number(data.duration)
    }
  })

  return Response.json(segment)
}

export async function DELETE(req: NextRequest) {
  const data = await req.json()

  const segment = await prisma.segment.delete({
    where: {
      id: String(data.id)
    }
  })

  return Response.json(segment)
}
