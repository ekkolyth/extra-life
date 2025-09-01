import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/convex';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rotators = await db.rotator.findMany();
    return Response.json(rotators);
  } catch (error) {
    console.error('Rotator API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
