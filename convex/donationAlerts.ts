import { ConvexError, v } from 'convex/values'
import { mutation, type QueryCtx, query } from './_generated/server'
import { requireSignedIn } from './lib/admin'

const TEST_ALERT = {
    displayName: 'Anonymous',
    amount: 250,
    message: 'For the kids!',
}

// stream alerts, test ones included, only run while live polling is on
async function alertsOn(ctx: QueryCtx): Promise<boolean> {
    const campaign = await ctx.db
        .query('campaigns')
        .withIndex('by_active', (q) => q.eq('isActive', true))
        .unique()
    return campaign?.livePolling === true
}

// public stream overlay subscription
export const pending = query({
    args: {},
    returns: v.array(
        v.object({
            _id: v.id('donationAlerts'),
            _creationTime: v.number(),
            displayName: v.optional(v.string()),
            amount: v.number(),
            message: v.optional(v.string()),
        })
    ),
    handler: async (ctx) => {
        if (!(await alertsOn(ctx))) return []
        const alerts = await ctx.db
            .query('donationAlerts')
            .withIndex('by_played_at', (q) => q.eq('playedAt', undefined))
            .order('asc')
            .collect()
        return alerts.map((alert) => ({
            _id: alert._id,
            _creationTime: alert._creationTime,
            displayName: alert.displayName,
            amount: alert.amount,
            message: alert.message,
        }))
    },
})

// the overlay acknowledges playback without auth; repeat calls are a no-op
export const markPlayed = mutation({
    args: { alertId: v.id('donationAlerts') },
    returns: v.null(),
    handler: async (ctx, args) => {
        const alert = await ctx.db.get(args.alertId)
        if (!alert || alert.playedAt !== undefined) return null
        await ctx.db.patch(alert._id, { playedAt: Date.now() })
        return null
    },
})

export const createTest = mutation({
    args: {},
    returns: v.null(),
    handler: async (ctx) => {
        await requireSignedIn(ctx)
        if (!(await alertsOn(ctx))) {
            throw new ConvexError(
                'Turn on live polling to test donation alerts'
            )
        }
        await ctx.db.insert('donationAlerts', TEST_ALERT)
        return null
    },
})
