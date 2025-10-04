import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const segments = defineTable({
  title: v.string(),
  startsAt: v.string(),
  duration: v.number(),
}).index('by_title', ['title']);
