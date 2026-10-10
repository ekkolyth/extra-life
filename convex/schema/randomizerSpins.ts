import { defineTable } from 'convex/server'
import { v } from 'convex/values'

export const randomizerSpins = defineTable({
    randomizerId: v.id('randomizers'),
    // snapshot so an edit mid-spin can't change what the overlay animates
    items: v.array(v.string()),
    result: v.string(),
})
