import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: { randomizerId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('wheelRedemptions')
      .filter((q) => q.eq(q.field('randomizerId'), args.randomizerId))
      .collect();
  },
});

export const clear = mutation({
  args: { randomizerId: v.string() },
  handler: async (ctx, args) => {
    const redemptions = await ctx.db
      .query('wheelRedemptions')
      .filter((q) => q.eq(q.field('randomizerId'), args.randomizerId))
      .collect();
    for (const r of redemptions) {
      await ctx.db.delete(r._id);
    }
  },
});

export const create = mutation({
  args: {
    randomizer: v.object({ connect: v.object({ id: v.string() }) }),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('wheelRedemptions', {
      randomizerId: args.randomizer.connect.id,
      createdAt: new Date().toISOString(),
    });
  },
});
