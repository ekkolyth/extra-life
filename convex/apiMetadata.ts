import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Get API metadata by key
export const get = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const metadata = await ctx.db
      .query('apiMetadata')
      .withIndex('by_key', (q) => q.eq('key', args.key))
      .first();

    return metadata;
  },
});

// Set API metadata
export const set = mutation({
  args: {
    key: v.string(),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('apiMetadata')
      .withIndex('by_key', (q) => q.eq('key', args.key))
      .first();

    const updatedAt = new Date().toISOString();

    if (existing) {
      // Update existing entry
      await ctx.db.patch(existing._id, {
        value: args.value,
        updatedAt,
      });
      return existing._id;
    } else {
      // Create new entry
      return await ctx.db.insert('apiMetadata', {
        key: args.key,
        value: args.value,
        updatedAt,
      });
    }
  },
});

// Get last API call timestamp
export const getLastApiCall = query({
  handler: async (ctx) => {
    const metadata = await ctx.db
      .query('apiMetadata')
      .withIndex('by_key', (q) => q.eq('key', 'lastApiCall'))
      .first();

    if (!metadata) {
      return {
        timestamp: 0,
        secondsAgo: Infinity,
      };
    }

    const timestamp = parseInt(metadata.value);
    const now = Date.now();

    return {
      timestamp,
      secondsAgo: Math.floor((now - timestamp) / 1000),
    };
  },
});

// Update last API call timestamp
export const updateLastApiCall = mutation({
  handler: async (ctx) => {
    const timestamp = Date.now().toString();

    const existing = await ctx.db
      .query('apiMetadata')
      .withIndex('by_key', (q) => q.eq('key', 'lastApiCall'))
      .first();

    const updatedAt = new Date().toISOString();

    if (existing) {
      await ctx.db.patch(existing._id, {
        value: timestamp,
        updatedAt,
      });
    } else {
      await ctx.db.insert('apiMetadata', {
        key: 'lastApiCall',
        value: timestamp,
        updatedAt,
      });
    }

    return parseInt(timestamp);
  },
});
