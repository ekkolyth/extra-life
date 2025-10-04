import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const apiMetadata = defineTable({
  key: v.string(), // 'lastApiCall', 'etagCache', etc.
  value: v.string(),
  updatedAt: v.string(),
}).index('by_key', ['key']);
