import { NextRequest, NextResponse } from 'next/server';
import { withVersion, fetchWithCache } from '@/lib/donor-drive-api';

export async function GET(request: NextRequest) {
  console.log('🔍 Donors API route called:', request.url);
  try {
    const { searchParams } = new URL(request.url);
    const participantId = searchParams.get('id');
    const limit = searchParams.get('limit') || '1';
    const orderBy = searchParams.get('orderBy') || 'sumDonations%20DESC';
    const where = searchParams.get('where') || 'sumDonations%20%3E%200';

    console.log('🔍 Donors params:', { participantId, limit, orderBy, where });

    if (!participantId) {
      console.log('❌ Missing participant ID for donors');
      return NextResponse.json({ error: 'Missing participant ID' }, { status: 400 });
    }

    const path = `/participants/${participantId}/donors?limit=${limit}&orderBy=${orderBy}&where=${where}`;
    const url = withVersion(path);
    const cacheKey = `donors-${participantId}-${limit}-${orderBy}-${where}`;

    const result = await fetchWithCache(cacheKey, url);

    if (result === 'Rate limited') {
      return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
    }

    if (result === 'Not modified') {
      return new Response(null, { status: 304 });
    }

    // Return the first donor if it's an array (top donor)
    const data = Array.isArray(result) ? result[0] || null : result;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in donors API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
