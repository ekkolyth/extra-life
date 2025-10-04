'use client';

import { RotatorForm } from '@/components/forms/rotator';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function RotatorPage() {
  const convexRotators = useQuery(api.rotator.list) || [];

  // Transform Convex data to match expected component types
  const rotators = convexRotators.map((r) => ({
    id: r._id,
    text: r.text,
  }));

  return <RotatorForm items={rotators} />;
}
