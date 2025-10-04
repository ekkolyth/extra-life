'use client';

import { RotatorForm } from '@/components/forms/rotator';
import { useConvexQuery } from '@convex-dev/react-query';
import { api } from '@/convex/_generated/api';

export default function RotatorPage() {
  const convexRotators = useConvexQuery(api.rotator.list, {}) || [];

  // Transform Convex data to match expected component types
  const rotators = convexRotators.map((r) => ({
    id: r._id,
    text: r.text,
  }));

  return <RotatorForm items={rotators} />;
}
