import { type Infer, v } from 'convex/values'

const donationTotalsValidator = v.object({
    years: v.array(
        v.object({ year: v.number(), total: v.number(), count: v.number() })
    ),
    total: v.number(),
})

type DonationTotals = Infer<typeof donationTotalsValidator>

type YearTotals = Map<number, { cents: number; count: number }>

const toCents = (dollars: number): number => Math.round(dollars * 100)

const addDonationToTotals = (
    byYear: YearTotals,
    row: { year: number; amount: number }
) => {
    const entry = byYear.get(row.year) ?? { cents: 0, count: 0 }
    entry.cents += toCents(row.amount)
    entry.count += 1
    byYear.set(row.year, entry)
}

const finishDonationTotals = (byYear: YearTotals): DonationTotals => {
    const years = [...byYear.entries()]
        .sort(([a], [b]) => b - a)
        .map(([year, { cents, count }]) => ({
            year,
            total: cents / 100,
            count,
        }))
    const totalCents = [...byYear.values()].reduce(
        (sum, entry) => sum + entry.cents,
        0
    )
    return { years, total: totalCents / 100 }
}

const summarizeDonationTotals = (
    rows: { year: number; amount: number }[]
): DonationTotals => {
    const byYear: YearTotals = new Map()
    for (const row of rows) addDonationToTotals(byYear, row)
    return finishDonationTotals(byYear)
}

export type { DonationTotals }
export {
    addDonationToTotals,
    donationTotalsValidator,
    finishDonationTotals,
    summarizeDonationTotals,
    toCents,
}
