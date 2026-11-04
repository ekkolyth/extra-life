import { v } from 'convex/values'
import { query } from './_generated/server'
import { summarizeDonationTotals } from './lib/donationTotals'
import { donationDoc } from './schema/donations'

const donationTotalsValidator = v.object({
    years: v.array(
        v.object({ year: v.number(), total: v.number(), count: v.number() })
    ),
    total: v.number(),
})

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

// open to signed-out callers: the marketing page reads it and it carries no donor data
export const totalsByYear = query({
    args: {},
    returns: donationTotalsValidator,
    handler: async (ctx) =>
        summarizeDonationTotals(await ctx.db.query('donations').collect()),
})
