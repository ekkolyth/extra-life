import { v } from 'convex/values'
import { query } from './_generated/server'
import { donationDoc } from './schema/donations'

export const latest = query({
    args: { year: v.number(), limit: v.number() },
    returns: v.array(donationDoc),
    handler: async (ctx, args) => {
        return await ctx.db
            .query('donations')
            .withIndex('by_year_created', (q) => q.eq('year', args.year))
            .order('desc')
            .take(args.limit)
    },
})

export const list = query({
    args: { year: v.number() },
    returns: v.array(donationDoc),
    handler: async (ctx, args) => {
        return await ctx.db
            .query('donations')
            .withIndex('by_year_created', (q) => q.eq('year', args.year))
            .order('desc')
            .collect()
    },
})
