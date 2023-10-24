'use server'

import { prisma } from '@/lib/prisma'

export async function getRandomizers() {
  const randomizers = await prisma.randomizer.findMany({
    include: {
      items: true
    }
  })
  return randomizers
}
