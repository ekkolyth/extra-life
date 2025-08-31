import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  goals: defineTable({
    title: v.string(),
    amount: v.number(),
    endOfStream: v.boolean()
  }),
  segments: defineTable({
    title: v.string(),
    startsAt: v.string(),
    duration: v.number()
  }),
  rotator: defineTable({
    text: v.string()
  }),
  randomizers: defineTable({
    name: v.string()
  }),
  randomizerItems: defineTable({
    name: v.string(),
    limit: v.number(),
    redeemed: v.number(),
    randomizerId: v.string()
  }),
  wheelRedemptions: defineTable({
    randomizerId: v.string(),
    createdAt: v.string()
  })
})
