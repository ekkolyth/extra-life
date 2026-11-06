import { describe, expect, test } from 'bun:test'
import { formatTimeLeft } from './time-left'

describe('formatTimeLeft', () => {
    test('formats hours, minutes, and seconds with padding', () => {
        expect(formatTimeLeft((26 * 3600 + 5 * 60 + 9) * 1000)).toBe(
            '26h 05m 09s'
        )
    })

    test('stops at zero once the end time has passed', () => {
        expect(formatTimeLeft(-90_000)).toBe('00h 00m 00s')
    })
})
