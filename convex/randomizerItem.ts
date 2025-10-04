import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const update = mutation({
  args: {
    id: v.id('randomizerItems'),
    redeemed: v.object({ increment: v.number() }),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) throw new Error('Item not found');
    const newRedeemed = (item.redeemed || 0) + args.redeemed.increment;
    await ctx.db.patch(args.id, { redeemed: newRedeemed });
    return await ctx.db.get(args.id);
  },
});
