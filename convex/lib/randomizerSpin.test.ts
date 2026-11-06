import { describe, expect, test } from 'bun:test'
import { pickSpin, splitItems } from './randomizerSpin'

describe('pickSpin', () => {
    test('picks from a single list and adds no second reel', () => {
        const spin = pickSpin(['a', 'b', 'c'], undefined, () => 0.5)
        expect(spin).toEqual({ items: ['a', 'b', 'c'], result: 'b' })
        expect('second' in spin).toBe(false)
    })

    test('picks one item from each list', () => {
        const rolls = [0.9, 0.1]
        let roll = 0
        const spin = pickSpin(['a', 'b', 'c'], ['x', 'y'], () => rolls[roll++])
        expect(spin).toEqual({
            items: ['a', 'b', 'c'],
            result: 'c',
            second: { items: ['x', 'y'], result: 'x' },
        })
    })
})

describe('splitItems', () => {
    test('puts untagged items in the first list and second-tagged items in the second', () => {
        const items = [
            { name: 'a' },
            { name: 'x', list: 'second' as const },
            { name: 'b' },
        ]
        expect(splitItems(items)).toEqual({
            first: [{ name: 'a' }, { name: 'b' }],
            second: [{ name: 'x', list: 'second' }],
        })
    })
})
