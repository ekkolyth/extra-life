import type { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { db } from '@/lib/convex';
import { getSegments } from '@/actions/segments';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await getSegments();
    return Response.json(data);
  } catch (error) {
    console.error('Segments GET API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const segment = await db.segment.create({
      data: { ...data, duration: Number(data.duration) },
    });

    return Response.json(segment);
  } catch (error) {
    console.error('Segments POST API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const segment = await db.segment.delete({
      where: { id: String(data.id) },
    });

    return Response.json(segment);
  } catch (error) {
    console.error('Segments DELETE API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
