import { ConvexError, v } from 'convex/values'
import { mutation, query } from './_generated/server'

function requireNames(name: string, items: { name: string }[]) {
    const trimmedName = name.trim()
    if (!trimmedName) throw new ConvexError('Randomizer name is required')
    const itemNames = items.map((item) => item.name.trim())
    if (itemNames.some((itemName) => !itemName)) {
        throw new ConvexError('Item name is required')
    }
    return { name: trimmedName, itemNames }
}

export const list = query({
    handler: async (ctx) => {
        const randomizers = await ctx.db.query('randomizers').collect()
        return await Promise.all(
            randomizers.map(async (r) => {
                const items = await ctx.db
                    .query('randomizerItems')
                    .filter((q) => q.eq(q.field('randomizerId'), r._id))
                    .collect()
                return { ...r, items }
            })
        )
    },
})

export const create = mutation({
    args: {
        name: v.string(),
        items: v.object({
            create: v.array(v.object({ name: v.string() })),
        }),
    },
    handler: async (ctx, args) => {
        const { name, itemNames } = requireNames(args.name, args.items.create)

        // Check if a randomizer with the same name already exists
        const existingRandomizer = await ctx.db
            .query('randomizers')
            .withIndex('by_name', (q) => q.eq('name', name))
            .first()

        if (existingRandomizer) {
            throw new ConvexError(
                `A randomizer with the name "${name}" already exists`
            )
        }

        const id = await ctx.db.insert('randomizers', { name })
        for (const itemName of itemNames) {
            // 0 means unlimited; redeems are no longer tracked
            await ctx.db.insert('randomizerItems', {
                name: itemName,
                limit: 0,
                redeemed: 0,
                randomizerId: id,
            })
        }
    },
})

export const update = mutation({
    args: {
        id: v.id('randomizers'),
        name: v.string(),
        items: v.object({
            create: v.array(v.object({ name: v.string() })),
        }),
    },
    handler: async (ctx, args) => {
        const { id } = args
        const { name, itemNames } = requireNames(args.name, args.items.create)
        await ctx.db.patch(id, { name })
        const existing = await ctx.db
            .query('randomizerItems')
            .filter((q) => q.eq(q.field('randomizerId'), id))
            .collect()
        for (const item of existing) {
            await ctx.db.delete(item._id)
        }
        for (const itemName of itemNames) {
            await ctx.db.insert('randomizerItems', {
                name: itemName,
                limit: 0,
                redeemed: 0,
                randomizerId: id,
            })
        }
    },
})

const remove = mutation({
    args: { id: v.id('randomizers') },
    handler: async (ctx, args) => {
        const items = await ctx.db
            .query('randomizerItems')
            .filter((q) => q.eq(q.field('randomizerId'), args.id))
            .collect()
        for (const item of items) {
            await ctx.db.delete(item._id)
        }
        await ctx.db.delete(args.id)
    },
})

export { remove as delete }
