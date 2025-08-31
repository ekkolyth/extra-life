'use server'

import { db } from '@/lib/convex'
import type { Rotator } from '@/types/db'
import { revalidatePath } from 'next/cache'

interface UpdateRotatorsPayload {
  items: Partial<Rotator>[]
}

export async function updateRotators(data: UpdateRotatorsPayload) {
  const { items } = data

  if (!items) throw new Error('No items provided')

  // Delete existing rotator items
  await db.rotator.deleteMany()

  // // Create new rotator items
  await db.rotator.createMany({
    data: items
      .filter(items => items.text !== '')
      .map((item: any) => ({
        text: item.text
      }))
  })

  revalidatePath('/admin/rotator')
}
