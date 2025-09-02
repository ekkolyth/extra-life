import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  handler: async (ctx) => {
    const randomizers = await ctx.db.query('randomizers').collect();
    return await Promise.all(
      randomizers.map(async (r) => {
        const items = await ctx.db
          .query('randomizerItems')
          .filter((q) => q.eq(q.field('randomizerId'), r._id))
          .collect();
        return { ...r, items };
      })
    );
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    items: v.object({
      create: v.array(v.object({ name: v.string(), limit: v.number() })),
    }),
  },
  handler: async (ctx, args) => {
    // Check if a randomizer with the same name already exists
    const existingRandomizer = await ctx.db
      .query('randomizers')
      .withIndex('by_name', (q) => q.eq('name', args.name))
      .first();

    if (existingRandomizer) {
      throw new Error(`A randomizer with the name "${args.name}" already exists`);
    }

    const id = await ctx.db.insert('randomizers', { name: args.name });
    for (const item of args.items.create) {
      await ctx.db.insert('randomizerItems', {
        name: item.name,
        limit: item.limit,
        redeemed: 0,
        randomizerId: id,
      });
    }
  },
});

export const update = mutation({
  args: {
    id: v.id('randomizers'),
    name: v.string(),
    items: v.object({
      create: v.array(v.object({ name: v.string(), limit: v.number() })),
    }),
  },
  handler: async (ctx, args) => {
    const { id, name, items } = args;
    await ctx.db.patch(id, { name });
    const existing = await ctx.db
      .query('randomizerItems')
      .filter((q) => q.eq(q.field('randomizerId'), id))
      .collect();
    for (const item of existing) {
      await ctx.db.delete(item._id);
    }
    for (const item of items.create) {
      await ctx.db.insert('randomizerItems', {
        name: item.name,
        limit: item.limit,
        redeemed: 0,
        randomizerId: id,
      });
    }
  },
});

const remove = mutation({
  args: { id: v.id('randomizers') },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query('randomizerItems')
      .filter((q) => q.eq(q.field('randomizerId'), args.id))
      .collect();
    for (const item of items) {
      await ctx.db.delete(item._id);
    }
    await ctx.db.delete(args.id);
  },
});

export { remove as delete };
