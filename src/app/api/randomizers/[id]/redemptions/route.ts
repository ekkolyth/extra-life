import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/convex';

export async function GET(request: Request, context: { params: Promise<any> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    const data = await db.wheelRedemption.findMany({
      where: { randomizerId: id },
    });

    return Response.json(data);
  } catch (error) {
    console.error('Redemptions API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<any> }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    const data = await db.wheelRedemption.deleteMany({ where: { randomizerId: id } });

    return Response.json(data);
  } catch (error) {
    console.error('Redemptions DELETE API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
