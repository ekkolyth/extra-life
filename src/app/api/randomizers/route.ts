import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/convex';

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await db.randomizer
      .findMany({
        include: {
          items: true,
        },
      })
      .then((r: any[]) =>
        r.map((r: any) => ({
          ...r,
          items: r.items.filter((i: any) => i.limit > i.redeemed),
        }))
      );

    return Response.json(data);
  } catch (error) {
    console.error('Randomizers API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
