import type { NextRequest } from 'next/server'

import { getServerSession } from 'next-auth'

import { prisma } from '@/lib/prisma'
import { authConfig } from '@/lib/auth'
import { getSegments } from '@/actions/segments'

export async function GET() {
  // const session = await getServerSession(authConfig)
  // if (!session) return Response.json({ error: 'Unauthorized' })

  const data = await getSegments()

  return Response.json(data)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authConfig)
  if (!session) return Response.json({ error: 'Unauthorized' })

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
  const session = await getServerSession(authConfig)
  if (!session) return Response.json({ error: 'Unauthorized' })

  const data = await req.json()

  const segment = await prisma.segment.delete({
    where: {
      id: String(data.id)
    }
  })

  return Response.json(segment)
}
