import { ConvexError, type ObjectType, v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { splitItems } from './lib/randomizerSpin'

function requireNames(name: string, items: { name: string }[]) {
    const trimmedName = name.trim()
    if (!trimmedName) throw new ConvexError('Randomizer name is required')
    const itemNames = items.map((item) => item.name.trim())
    if (itemNames.some((itemName) => !itemName)) {
        throw new ConvexError('Item name is required')
    }
    return { name: trimmedName, itemNames }
}

const dualArgs = {
    secondItems: v.optional(
        v.object({ create: v.array(v.object({ name: v.string() })) })
    ),
    firstListName: v.optional(v.string()),
    secondListName: v.optional(v.string()),
}

function requireDual(args: ObjectType<typeof dualArgs>) {
    if (!args.secondItems) return null
    const firstListName = args.firstListName?.trim()
    const secondListName = args.secondListName?.trim()
    if (!firstListName || !secondListName) {
        throw new ConvexError('List name is required')
    }
    const secondItemNames = args.secondItems.create.map((item) =>
        item.name.trim()
    )
    if (secondItemNames.some((itemName) => !itemName)) {
        throw new ConvexError('Item name is required')
    }
    return { firstListName, secondListName, secondItemNames }
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
                const { first, second } = splitItems(items)
                return { ...r, items: first, secondItems: second }
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
        ...dualArgs,
    },
    handler: async (ctx, args) => {
        const { name, itemNames } = requireNames(args.name, args.items.create)
        const dual = requireDual(args)

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

        const id = await ctx.db.insert('randomizers', {
            name,
            ...(dual
                ? {
                      kind: 'dual' as const,
                      firstListName: dual.firstListName,
                      secondListName: dual.secondListName,
                  }
                : {}),
        })
        for (const itemName of itemNames) {
            // 0 means unlimited; redeems are no longer tracked
            await ctx.db.insert('randomizerItems', {
                name: itemName,
                limit: 0,
                redeemed: 0,
                randomizerId: id,
            })
        }
        for (const itemName of dual?.secondItemNames ?? []) {
            await ctx.db.insert('randomizerItems', {
                name: itemName,
                limit: 0,
                redeemed: 0,
                randomizerId: id,
                list: 'second' as const,
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
        ...dualArgs,
    },
    handler: async (ctx, args) => {
        const { id } = args
        const { name, itemNames } = requireNames(args.name, args.items.create)
        const dual = requireDual(args)
        await ctx.db.patch(id, {
            name,
            ...(dual
                ? {
                      kind: 'dual' as const,
                      firstListName: dual.firstListName,
                      secondListName: dual.secondListName,
                  }
                : {}),
        })
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
        for (const itemName of dual?.secondItemNames ?? []) {
            await ctx.db.insert('randomizerItems', {
                name: itemName,
                limit: 0,
                redeemed: 0,
                randomizerId: id,
                list: 'second' as const,
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
