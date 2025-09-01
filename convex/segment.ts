import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('segments').collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    startsAt: v.string(),
    duration: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if a segment with the same title already exists
    const existingSegment = await ctx.db
      .query('segments')
      .withIndex('by_title', (q) => q.eq('title', args.title))
      .first();

    if (existingSegment) {
      throw new Error(`A segment with the title "${args.title}" already exists`);
    }

    await ctx.db.insert('segments', args);
  },
});

export const update = mutation({
  args: {
    id: v.id('segments'),
    title: v.optional(v.string()),
    startsAt: v.optional(v.string()),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;

    // If title is being updated, check for uniqueness
    if (data.title) {
      const existingSegment = await ctx.db
        .query('segments')
        .withIndex('by_title', (q) => q.eq('title', data.title!))
        .filter((q) => q.neq(q.field('_id'), id))
        .first();

      if (existingSegment) {
        throw new Error(`A segment with the title "${data.title}" already exists`);
      }
    }

    await ctx.db.patch(id, data);
  },
});

export const removeSegment = mutation({
  args: { id: v.id('segments') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
