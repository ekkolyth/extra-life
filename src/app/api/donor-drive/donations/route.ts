import { NextRequest, NextResponse } from 'next/server';
import { withVersion, fetchWithCache } from '@/lib/donor-drive-api';

export async function GET(request: NextRequest) {
  console.log('🔍 Donations API route called:', request.url);
  try {
    const { searchParams } = new URL(request.url);
    const participantId = searchParams.get('id');
    const limit = searchParams.get('limit') || '10';
    const orderBy = searchParams.get('orderBy') || 'createdDateUTC%20DESC';
    const filter = searchParams.get('filter'); // For wheel spin filtering

    console.log('🔍 Donations params:', { participantId, limit, orderBy, filter });

    if (!participantId) {
      console.log('❌ Missing participant ID for donations');
      return NextResponse.json({ error: 'Missing participant ID' }, { status: 400 });
    }

    // Build URL based on parameters
    let path = `/participants/${participantId}/donations?limit=${limit}&orderBy=${orderBy}`;

    // Add wheel spin filtering if requested
    if (filter === 'wheel-spins') {
      // This will be filtered client-side since Donor Drive doesn't support amount ranges
      path = `/participants/${participantId}/donations?limit=100&orderBy=amount%20DESC`;
    } else if (filter === 'big-wheel-spins') {
      path = `/participants/${participantId}/donations?limit=100&orderBy=amount%20DESC`;
    }

    const url = withVersion(path);
    const cacheKey = `donations-${participantId}-${limit}-${orderBy}-${filter || 'default'}`;

    const result = await fetchWithCache(cacheKey, url);

    if (result === 'Rate limited') {
      return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
    }

    if (result === 'Not modified') {
      return new Response(null, { status: 304 });
    }

    // Apply client-side filtering for wheel spins
    let filteredData = result;
    if (filter === 'wheel-spins' && Array.isArray(result)) {
      filteredData = result.filter(
        (donation: { amount: number }) => donation.amount >= 20 && donation.amount <= 99.99
      );
    } else if (filter === 'big-wheel-spins' && Array.isArray(result)) {
      filteredData = result.filter((donation: { amount: number }) => donation.amount >= 100);
    }

    return NextResponse.json(filteredData);
  } catch (error) {
    console.error('Error in donations API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
