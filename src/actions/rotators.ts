'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/convex';

export async function getRotators() {
  return await db.rotator.findMany();
}

export async function createRotators(formData: FormData) {
  const rotators = JSON.parse(formData.get('rotators') as string);

  await db.rotator.deleteMany();
  await db.rotator.createMany({
    data: rotators,
  });

  revalidatePath('/dashboard/rotator');
}
