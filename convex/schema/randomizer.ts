import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const randomizers = defineTable({
  name: v.string(),
}).index('by_name', ['name']);

export const randomizerItems = defineTable({
  name: v.string(),
  limit: v.number(),
  redeemed: v.number(),
  randomizerId: v.string(),
});
