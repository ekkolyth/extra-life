import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('goals').collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    amount: v.number(),
    endOfStream: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check if a goal with the same title already exists
    const existingGoal = await ctx.db
      .query('goals')
      .withIndex('by_title', (q) => q.eq('title', args.title))
      .first();

    if (existingGoal) {
      throw new Error(`A goal with the title "${args.title}" already exists`);
    }

    await ctx.db.insert('goals', args);
  },
});

export const update = mutation({
  args: {
    id: v.id('goals'),
    title: v.optional(v.string()),
    amount: v.optional(v.number()),
    endOfStream: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;

    // If title is being updated, check for uniqueness
    if (data.title) {
      const existingGoal = await ctx.db
        .query('goals')
        .withIndex('by_title', (q) => q.eq('title', data.title!))
        .filter((q) => q.neq(q.field('_id'), id))
        .first();

      if (existingGoal) {
        throw new Error(`A goal with the title "${data.title}" already exists`);
      }
    }

    await ctx.db.patch(id, data);
  },
});

export const removeGoal = mutation({
  args: { id: v.id('goals') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
