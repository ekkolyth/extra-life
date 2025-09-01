'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/convex';

export async function getGoals() {
  return await db.goal.findMany();
}

export async function createGoal(formData: FormData) {
  const title = formData.get('title') as string;
  const amount = Number(formData.get('amount'));
  const endOfStream = formData.get('endOfStream') === 'on';

  if (!title || !amount) {
    throw new Error('Missing required fields');
  }

  await db.goal.create({
    data: {
      title,
      amount,
      endOfStream,
    },
  });

  revalidatePath('/dashboard/goals');
  redirect('/dashboard/goals');
}

export async function updateGoal(id: string, formData: FormData) {
  const title = formData.get('title') as string;
  const amount = Number(formData.get('amount'));
  const endOfStream = formData.get('endOfStream') === 'on';

  if (!title || !amount) {
    throw new Error('Missing required fields');
  }

  await db.goal.update({
    where: { id },
    data: {
      title,
      amount,
      endOfStream,
    },
  });

  revalidatePath('/dashboard/goals');
  redirect('/dashboard/goals');
}

export async function deleteGoal(formData: FormData) {
  const id = formData.get('id') as string;
  await db.goal.delete({
    where: { id },
  });

  revalidatePath('/dashboard/goals');
  redirect('/dashboard/goals');
}
