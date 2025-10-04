import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const goals = defineTable({
  title: v.string(),
  amount: v.number(),
  endOfStream: v.boolean(),
}).index('by_title', ['title']);
