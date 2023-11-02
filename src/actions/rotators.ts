'use server'

import { prisma } from '@/lib/prisma'
import { Rotator } from '@prisma/client'
import { revalidatePath } from 'next/cache'

interface UpdateRotatorsPayload {
  items: Partial<Rotator>[]
}

export async function updateRotators(data: UpdateRotatorsPayload) {
  const { items } = data

  if (!items) throw new Error('No items provided')

  // Delete existing rotator items
  await prisma.rotator.deleteMany({})

  // // Create new rotator items
  await prisma.rotator.createMany({
    data: items
      .filter(items => items.text !== '')
      .map((item: any) => ({
        text: item.text
      }))
  })

  revalidatePath('/admin/rotator')
}
