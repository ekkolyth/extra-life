import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  handler: async ctx => {
    return await ctx.db.query('goals').collect()
  }
})

export const create = mutation({
  args: {
    title: v.string(),
    amount: v.number(),
    endOfStream: v.boolean()
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('goals', args)
  }
})

export const update = mutation({
  args: {
    id: v.id('goals'),
    title: v.optional(v.string()),
    amount: v.optional(v.number()),
    endOfStream: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args
    await ctx.db.patch(id, data)
  }
})

const removeGoal = mutation({
  args: { id: v.id('goals') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  }
})

export { removeGoal as delete }
