'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getGoals() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/goals`);
  if (!response.ok) {
    throw new Error('Failed to fetch goals');
  }
  return response.json();
}

export async function createGoal(formData: FormData) {
  const title = formData.get('title') as string;
  const amount = Number(formData.get('amount'));
  const endOfStream = formData.get('endOfStream') === 'on';

  if (!title || !amount) {
    throw new Error('Missing required fields');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/goals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      amount,
      endOfStream,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create goal');
  }

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

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/goals`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      title,
      amount,
      endOfStream,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update goal');
  }

  revalidatePath('/dashboard/goals');
  redirect('/dashboard/goals');
}

export async function deleteGoal(id: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/goals?id=${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete goal');
  }

  revalidatePath('/dashboard/goals');
  redirect('/dashboard/goals');
}
