'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/convex';
import type { Rotator } from '@/types/db';

export async function getRotators() {
  return await db.rotator.findMany();
}

export async function updateRotators(rotators: { id?: string; text: string }[]) {
  await db.rotator.deleteMany();
  await db.rotator.createMany({
    data: rotators,
  });

  revalidatePath('/dashboard/rotator');
}
