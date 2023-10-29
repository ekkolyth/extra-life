'use server'

import * as z from 'zod'

import { prisma } from '@/lib/prisma'
import { formSchema } from '@/forms/randomizer'
import { RandomizerItem } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function getRandomizers() {
  const randomizers = await prisma.randomizer.findMany({
    include: {
      items: true
    }
  })
  return randomizers
}

export async function createRandomizer(data: z.infer<typeof formSchema>) {
  const { name, items } = data
  await prisma.randomizer.create({
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
  await prisma.randomizer.update({
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

  await prisma.randomizer.delete({
    where: {
      id: id.toString()
    }
  })

  revalidatePath('/admin/randomizer')
}
