import { ConvexError, v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { pickSpin, splitItems } from './lib/randomizerSpin'
import { spinReel } from './schema/randomizerSpins'

export const latest = query({
    args: {},
    returns: v.union(
        v.object({
            _id: v.id('randomizerSpins'),
            _creationTime: v.number(),
            randomizerId: v.id('randomizers'),
            items: v.array(v.string()),
            result: v.string(),
            second: v.optional(spinReel),
        }),
        v.null()
    ),
    handler: async (ctx) => {
        return await ctx.db.query('randomizerSpins').order('desc').first()
    },
})

export const trigger = mutation({
    args: { randomizerId: v.id('randomizers') },
    returns: v.null(),
    handler: async (ctx, args) => {
        const randomizer = await ctx.db.get(args.randomizerId)
        if (!randomizer) throw new ConvexError('Randomizer not found')

        const items = await ctx.db
            .query('randomizerItems')
            .filter((q) => q.eq(q.field('randomizerId'), args.randomizerId))
            .collect()
        const { first: firstItems, second: secondItems } = splitItems(items)
        if (firstItems.length === 0) {
            throw new ConvexError(`"${randomizer.name}" has no items`)
        }

        const secondNames =
            randomizer.kind === 'dual'
                ? secondItems.map((item) => item.name)
                : undefined
        await ctx.db.insert('randomizerSpins', {
            randomizerId: args.randomizerId,
            ...pickSpin(
                firstItems.map((item) => item.name),
                secondNames,
                Math.random
            ),
        })
        return null
    },
})
