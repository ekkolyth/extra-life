'use server';

import { revalidatePath } from 'next/cache';

export async function getRandomizers() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/randomizers`);
  if (!response.ok) {
    throw new Error('Failed to fetch randomizers');
  }
  return response.json();
}

export async function createRandomizer(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  if (!name) {
    throw new Error('Missing required fields');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/randomizers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create randomizer');
  }

  revalidatePath('/dashboard/randomizer');
}

export async function updateRandomizer(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  if (!name) {
    throw new Error('Missing required fields');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/randomizers`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      name,
      description,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update randomizer');
  }

  revalidatePath('/dashboard/randomizer');
}

export async function deleteRandomizer(id: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/randomizers?id=${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete randomizer');
  }

  revalidatePath('/dashboard/randomizer');
}
