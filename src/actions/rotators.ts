'use server';

import { revalidatePath } from 'next/cache';

export async function getRotators() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/rotator`);
  if (!response.ok) {
    throw new Error('Failed to fetch rotators');
  }
  return response.json();
}

export async function createRotators(formData: FormData) {
  const rotators = JSON.parse(formData.get('rotators') as string);

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/rotator`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ rotators }),
  });

  if (!response.ok) {
    throw new Error('Failed to create rotators');
  }

  revalidatePath('/dashboard/rotator');
}
