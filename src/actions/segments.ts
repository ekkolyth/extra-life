'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getSegments() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/segments`);
  if (!response.ok) {
    throw new Error('Failed to fetch segments');
  }
  return response.json();
}

export async function createSegment(formData: FormData) {
  const title = formData.get('title') as string;
  const startsAt = formData.get('startsAt') as string;
  const duration = Number(formData.get('duration'));

  if (!title || !startsAt || !duration) {
    throw new Error('Missing required fields');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/segments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      startsAt,
      duration,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create segment');
  }

  revalidatePath('/dashboard/schedule');
  redirect('/dashboard/schedule');
}

export async function deleteSegment(id: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/segments?id=${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete segment');
  }

  revalidatePath('/dashboard/schedule');
  redirect('/dashboard/schedule');
}
