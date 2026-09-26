import { v } from 'convex/values'
import { query } from './_generated/server'
import { donorDoc } from './schema/donors'

export const top = query({
    args: { year: v.number() },
    returns: v.union(donorDoc, v.null()),
    handler: async (ctx, args) => {
        return await ctx.db
            .query('donors')
            .withIndex('by_year_sum', (q) => q.eq('year', args.year))
            .order('desc')
            .first()
    },
})
