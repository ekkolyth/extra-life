import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  handler: async ctx => {
    return await ctx.db.query('segments').collect()
  }
})

export const create = mutation({
  args: {
    title: v.string(),
    startsAt: v.string(),
    duration: v.number()
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('segments', args)
  }
})

const remove = mutation({
  args: { id: v.id('segments') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  }
})

export { remove as delete }
