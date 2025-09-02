import type { Randomizer, RandomizerItem } from '@/types/db'

export type AblyMessage = {
  name: string;
  data: unknown;
};

export type NestedRandomizer = Randomizer & {
  items: RandomizerItem[];
};
