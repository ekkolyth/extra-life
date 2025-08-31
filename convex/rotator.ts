import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  handler: async ctx => {
    return await ctx.db.query('rotator').collect()
  }
})

export const addMany = mutation({
  args: {
    data: v.array(
      v.object({
        text: v.string()
      })
    )
  },
  handler: async (ctx, args) => {
    for (const item of args.data) {
      await ctx.db.insert('rotator', item)
    }
  }
})

export const clear = mutation({
  handler: async ctx => {
    const items = await ctx.db.query('rotator').collect()
    for (const item of items) {
      await ctx.db.delete(item._id)
    }
  }
})
