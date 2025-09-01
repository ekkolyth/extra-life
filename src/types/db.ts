export interface Goal {
  id: string
  title: string
  amount: number
  endOfStream: boolean
}

export interface Segment {
  id: string
  title: string
  startsAt: string
  duration: number
}

export interface Rotator {
  id: string
  text: string
}

export interface RandomizerItem {
  id: string
  name: string
  limit: number
  redeemed: number
  randomizerId: string
}

export interface WheelRedemption {
  id: string
  randomizerId: string
  createdAt: string
}

export interface Randomizer {
  id: string
  name: string
  items: RandomizerItem[]
  redemptions: WheelRedemption[]
}
