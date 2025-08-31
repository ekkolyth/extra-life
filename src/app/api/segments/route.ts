import type { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'

import { db } from '@/lib/convex'
import { getSegments } from '@/actions/segments'

export async function GET() {
  const { userId } = auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const data = await getSegments()
  return Response.json(data)
}

export async function POST(req: NextRequest) {
  const { userId } = auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const data = await req.json()
  const segment = await db.segment.create({
    data: { ...data, duration: Number(data.duration) }
  })

  return Response.json(segment)
}

export async function DELETE(req: NextRequest) {
  const { userId } = auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const data = await req.json()
  const segment = await db.segment.delete({
    where: { id: String(data.id) }
  })

  return Response.json(segment)
}
