import { describe, expect, test } from 'bun:test'
import {
    addDonationToTotals,
    finishDonationTotals,
    summarizeDonationTotals,
} from './donationTotals'

describe('summarizeDonationTotals', () => {
    test('returns empty totals for no rows', () => {
        expect(summarizeDonationTotals([])).toEqual({ years: [], total: 0 })
    })

    test('groups by year descending and sums in cents', () => {
        const result = summarizeDonationTotals([
            { year: 2019, amount: 10.95 },
            { year: 2019, amount: 10.95 },
            { year: 2024, amount: 25 },
            { year: 2017, amount: 0.1 },
            { year: 2017, amount: 0.2 },
        ])

        expect(result).toEqual({
            years: [
                { year: 2024, total: 25, count: 1 },
                { year: 2019, total: 21.9, count: 2 },
                { year: 2017, total: 0.3, count: 2 },
            ],
            total: 47.2,
        })
    })

    test('accumulates rows one at a time to the same result', () => {
        const rows = [
            { year: 2019, amount: 10.95 },
            { year: 2024, amount: 25 },
            { year: 2019, amount: 10.95 },
        ]
        const byYear = new Map<number, { cents: number; count: number }>()
        for (const row of rows) addDonationToTotals(byYear, row)
        expect(finishDonationTotals(byYear)).toEqual(
            summarizeDonationTotals(rows)
        )
    })
})
