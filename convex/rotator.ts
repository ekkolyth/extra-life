import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('rotator').collect();
  },
});

export const create = mutation({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if a rotator with the same text already exists
    const existingRotator = await ctx.db
      .query('rotator')
      .withIndex('by_text', (q) => q.eq('text', args.text))
      .first();

    if (existingRotator) {
      throw new Error(`A rotator with the text "${args.text}" already exists`);
    }

    await ctx.db.insert('rotator', args);
  },
});

export const update = mutation({
  args: {
    id: v.id('rotator'),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if another rotator with the same text already exists
    const existingRotator = await ctx.db
      .query('rotator')
      .withIndex('by_text', (q) => q.eq('text', args.text))
      .filter((q) => q.neq(q.field('_id'), args.id))
      .first();

    if (existingRotator) {
      throw new Error(`A rotator with the text "${args.text}" already exists`);
    }

    await ctx.db.patch(args.id, { text: args.text });
  },
});

export const remove = mutation({
  args: {
    id: v.id('rotator'),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
