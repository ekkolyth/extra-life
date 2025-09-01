import { auth } from '@clerk/nextjs/server';

import { getGoals } from '@/actions/goals';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await getGoals();
    return Response.json(data);
  } catch (error) {
    console.error('Goals API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
