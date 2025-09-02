import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  try {
    const rotators = await convex.query(api.rotator.list);
    return NextResponse.json(rotators);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch rotators' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { rotators: { text: string }[] };
    const existing = await convex.query(api.rotator.list);
    await Promise.all(
      existing.map((r) =>
        convex.mutation(api.rotator.remove, { id: r._id as Id<'rotator'> })
      )
    );
    await Promise.all(
      body.rotators.map((r) => convex.mutation(api.rotator.create, { text: r.text }))
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create rotators' }, { status: 500 });
  }
}
