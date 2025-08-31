'use server'

import * as z from 'zod'

import { db } from '@/lib/convex'
import { formSchema } from '@/forms/randomizer'
import { revalidatePath } from 'next/cache'

export async function getRandomizers() {
  const randomizers = await db.randomizer.findMany({
    include: {
      items: true
    }
  })
  return randomizers
}

export async function createRandomizer(data: z.infer<typeof formSchema>) {
  const { name, items } = data
  await db.randomizer.create({
    data: {
      name,
      items: {
        create: items
      }
    }
  })

  revalidatePath('/admin/randomizer')
}

export async function updateRandomizer(id: string, data: z.infer<typeof formSchema>) {
  const { name, items } = data
  await db.randomizer.update({
    where: {
      id
    },
    data: {
      name,
      items: {
        deleteMany: {},
        create: items
      }
    }
  })

  revalidatePath('/admin/randomizer')
}

export async function deleteRandomizer(id: string) {
  console.log(id)

  await db.randomizer.delete({
    where: {
      id: id.toString()
    }
  })

  revalidatePath('/admin/randomizer')
}
