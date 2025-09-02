import type { Id } from '@/convex/_generated/dataModel';

export interface Goal {
  id: Id<'goals'>;
  title: string;
  amount: number;
  endOfStream: boolean;
}

export interface Segment {
  id: Id<'segments'>;
  title: string;
  startsAt: string;
  duration: number;
}

export interface Rotator {
  id: Id<'rotator'>;
  text: string;
}

export interface RandomizerItem {
  id: Id<'randomizerItems'>;
  name: string;
  limit: number;
  redeemed: number;
  randomizerId: string;
}

export interface WheelRedemption {
  id: Id<'wheelRedemptions'>;
  randomizerId: string;
  createdAt: string;
}

export interface Randomizer {
  id: Id<'randomizers'>;
  name: string;
  items: RandomizerItem[];
  redemptions: WheelRedemption[];
}
