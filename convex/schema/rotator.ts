import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const rotator = defineTable({
  text: v.string(),
}).index('by_text', ['text']);
