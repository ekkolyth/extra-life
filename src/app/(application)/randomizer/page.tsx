'use client';

import { RandomizerForm } from '@/components/original/forms/randomizer';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Randomizer } from '@/types/db';

export default function RandomizerPage() {
  const convexRandomizers = useQuery(api.randomizer.list) || [];

  // Transform Convex data to match expected component types
  const randomizers: Randomizer[] = convexRandomizers.map((r) => ({
    id: r._id,
    name: r.name,
    items:
      r.items?.map((item) => ({
        id: item._id,
        name: item.name,
        limit: item.limit,
        redeemed: item.redeemed,
        randomizerId: item.randomizerId,
      })) || [],
    redemptions: [], // TODO: Implement redemptions query
  }));

  return (
    <div className='space-y-6'>
      {randomizers.map((randomizer: Randomizer) => (
        <RandomizerForm key={randomizer.id} randomizer={randomizer} />
      ))}
      <RandomizerForm />
    </div>
  );
}
