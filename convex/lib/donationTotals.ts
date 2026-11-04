type DonationTotals = {
    years: { year: number; total: number; count: number }[]
    total: number
}

const summarizeDonationTotals = (
    rows: { year: number; amount: number }[]
): DonationTotals => {
    const byYear = new Map<number, { cents: number; count: number }>()
    for (const row of rows) {
        const entry = byYear.get(row.year) ?? { cents: 0, count: 0 }
        entry.cents += Math.round(row.amount * 100)
        entry.count += 1
        byYear.set(row.year, entry)
    }
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

export type { DonationTotals }
export { summarizeDonationTotals }
