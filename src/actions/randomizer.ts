'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/convex';

export async function getRandomizers() {
  return await db.randomizer.findMany({
    include: {
      items: true,
    },
  });
}

export async function createRandomizer(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  if (!name) {
    throw new Error('Missing required fields');
  }

  await db.randomizer.create({
    data: {
      name,
      description,
    },
  });

  revalidatePath('/dashboard/randomizer');
}

export async function updateRandomizer(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  if (!name) {
    throw new Error('Missing required fields');
  }

  await db.randomizer.update({
    where: { id },
    data: {
      name,
      description,
    },
  });

  revalidatePath('/dashboard/randomizer');
}

export async function deleteRandomizer(id: string) {
  await db.randomizer.delete({
    where: { id },
  });

  revalidatePath('/dashboard/randomizer');
}
