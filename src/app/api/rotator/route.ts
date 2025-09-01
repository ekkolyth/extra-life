import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  try {
    const rotators = await convex.query(api.rotator.list);
    return NextResponse.json(rotators);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rotators' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await convex.mutation(api.rotator.clear);
    await convex.mutation(api.rotator.addMany, { data: body.rotators });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create rotators' }, { status: 500 });
  }
}
