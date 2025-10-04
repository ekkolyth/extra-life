import { NextRequest, NextResponse } from 'next/server';
import { withVersion, fetchWithCache } from '@/lib/donor-drive-api';

export async function GET(request: NextRequest) {
  console.log('🔍 Participant API route called:', request.url);
  try {
    const { searchParams } = new URL(request.url);
    const participantId = searchParams.get('id');

    console.log('🔍 Participant ID:', participantId);

    if (!participantId) {
      console.log('❌ Missing participant ID');
      return NextResponse.json({ error: 'Missing participant ID' }, { status: 400 });
    }

    const url = withVersion(`/participants/${participantId}`);
    const cacheKey = `participant-${participantId}`;

    const result = await fetchWithCache(cacheKey, url);

    if (result === 'Rate limited') {
      return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
    }

    if (result === 'Not modified') {
      return new Response(null, { status: 304 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in participant API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
