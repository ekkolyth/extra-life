import type { Randomizer, RandomizerItem } from '@prisma/client'

export type AblyMessage = {
  name: string
  data: any
}

export type NestedRandomizer = Randomizer & {
  items: RandomizerItem[]
}
