import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/convex';

export async function PUT(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();

    const data = await db.randomizerItem.update({
      where: { id },
      data: {
        redeemed: {
          increment: 1,
        },
      },
    });

    await db.wheelRedemption.create({
      data: {
        randomizer: {
          connect: {
            id: data.randomizerId,
          },
        },
      },
    });

    return Response.json(data);
  } catch (error) {
    console.error('Randomizer items PUT API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
