'use server';

import { revalidatePath, redirect } from 'next/cache';
import { db } from '@/lib/convex';

export async function getSegments() {
  return await db.segment.findMany();
}

export async function createSegment(formData: FormData) {
  const title = formData.get('title') as string;
  const duration = Number(formData.get('duration'));

  if (!title || !duration) {
    throw new Error('Missing required fields');
  }

  await db.segment.create({
    data: {
      title,
      duration,
    },
  });

  revalidatePath('/dashboard/schedule');
  redirect('/dashboard/schedule');
}

export async function deleteSegment(id: string) {
  await db.segment.delete({
    where: { id },
  });

  revalidatePath('/dashboard/schedule');
  redirect('/dashboard/schedule');
}
