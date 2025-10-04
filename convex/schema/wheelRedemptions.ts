import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const wheelRedemptions = defineTable({
  randomizerId: v.string(),
  createdAt: v.string(),
});
