import { describe, expect, test } from 'bun:test'
import {
    type ExportDonationRow,
    fillMissingAmounts,
    parseDonorDriveExport,
} from './donordriveExport'

const loadSample = (name: string) =>
    Bun.file(
        new URL(
            `../../testdata/contracts/donordrive-export/${name}`,
            import.meta.url
        )
    ).text()

const EIGHT_COLUMN_INCENTIVE_ROWS =
    '\uFEFFSample_Participant - Donor Export\nDate: 11/04/2026 5:25 PM \n\nName,Show Name,Amount,Show Amount,Date/Time (ET),Email,Message,Show Message\nWheel Fan,Public,20.00,Public,11/05/2022 8:00PM,wheel.fan@example.com,spin it,Public\r\nPlain Donor,Public,15.00,Public,11/05/2022 7:00PM,plain@example.com,,Public'

const HEADER_LINES =
    'Title\nDate: 11/04/2026 5:25 PM \n\nName,Show Name,Amount,Show Amount,Date/Time (ET),Email,Message,Show Message\n'

describe('parseDonorDriveExport', () => {
    test('parses the sample cleanly', async () => {
        const { rows, errors } = await parseDonorDriveExport(
            await loadSample('sample.csv')
        )
        expect(errors).toEqual([])
        expect(rows.length).toBe(7)
    })

    test('maps a public row', async () => {
        const { rows } = await parseDonorDriveExport(
            await loadSample('sample.csv')
        )
        expect(rows[0]).toMatchObject({
            year: 2024,
            amount: 25,
            displayName: 'Pixel Paladin 🐾',
            message: 'Go team, go!',
            email: 'pixel.paladin@example.com',
            createdAt: Date.UTC(2024, 10, 10, 3, 20),
            isRegFee: false,
            source: 'csv',
        })
    })

    test('drops a private name and a private message but keeps the email', async () => {
        const { rows } = await parseDonorDriveExport(
            await loadSample('sample.csv')
        )
        expect(rows[1]?.displayName).toBeUndefined()
        expect(rows[1]?.message).toBeUndefined()
        expect(rows[1]?.email).toBe('hidden.helper@example.com')
        expect(rows[1]?.createdAt).toBe(Date.UTC(2024, 10, 10, 2, 31))
    })

    test('maps an anonymous row', async () => {
        const { rows } = await parseDonorDriveExport(
            await loadSample('sample.csv')
        )
        expect(rows[2]?.amount).toBeUndefined()
        expect(rows[2]?.displayName).toBeUndefined()
        expect(rows[2]?.email).toBeUndefined()
        expect(rows[2]?.message).toBeUndefined()
        expect(rows[2]?.createdAt).toBe(Date.UTC(2019, 10, 2, 18, 33))
    })

    test('gives identical rows distinct IDs', async () => {
        const { rows } = await parseDonorDriveExport(
            await loadSample('sample.csv')
        )
        expect(rows[3]?.amount).toBe(5)
        expect(rows[4]?.amount).toBe(5)
        expect(rows[3]?.donationID).not.toBe(rows[4]?.donationID)
    })

    test('reads a thousands separator and an escaped quote, and converts EDT', async () => {
        const { rows } = await parseDonorDriveExport(
            await loadSample('sample.csv')
        )
        expect(rows[5]?.amount).toBe(1250)
        expect(rows[5]?.message).toBe('She said "wow"')
        expect(rows[5]?.createdAt).toBe(Date.UTC(2018, 10, 3, 8, 5))
    })

    test('keeps a bare quote mid-field as text', async () => {
        const { rows } = await parseDonorDriveExport(
            await loadSample('sample.csv')
        )
        expect(rows[6]?.message).toBe('Y\'all are 5" tall')
        expect(rows[6]?.amount).toBe(7)
    })

    test('omits the message on a public row with an empty message', async () => {
        const { rows } = await parseDonorDriveExport(
            await loadSample('sample.csv')
        )
        expect(rows[3]).not.toHaveProperty('message')
    })

    test('reports a closing quote followed by text and keeps the other rows', async () => {
        const text =
            HEADER_LINES +
            'Bad,Public,5.00,Public,11/05/2022 7:00PM,"a"b,hi,Public\nGood,Public,6.00,Public,11/05/2022 8:00PM,g@example.com,hi,Public\n'
        const { rows, errors } = await parseDonorDriveExport(text)
        expect(errors).toEqual([{ line: 5, message: 'malformed quoted field' }])
        expect(rows.map((r) => r.amount)).toEqual([6])
    })

    test('reports an amount with no digits', async () => {
        const text =
            HEADER_LINES +
            'Bad,Public,",",Public,11/05/2022 7:00PM,a@example.com,hi,Public\n'
        const { rows, errors } = await parseDonorDriveExport(text)
        expect(rows).toEqual([])
        expect(errors.length).toBe(1)
        expect(errors[0]?.message).toContain('not a dollar amount')
    })

    test('reports an out-of-range date and time', async () => {
        const text =
            HEADER_LINES +
            'Bad,Public,5.00,Public,13/40/2024 25:00PM,a@example.com,hi,Public\n'
        const { rows, errors } = await parseDonorDriveExport(text)
        expect(rows).toEqual([])
        expect(errors.length).toBe(1)
        expect(errors[0]?.message).toContain('expected MM/DD/YYYY h:mmAM')
    })

    test('produces stable IDs', async () => {
        const text = await loadSample('sample.csv')
        const first = await parseDonorDriveExport(text)
        const second = await parseDonorDriveExport(text)
        for (const row of first.rows) {
            expect(row.donationID).toMatch(/^csv:[0-9a-f]{16}$/)
        }
        expect(second.rows.map((row) => row.donationID)).toEqual(
            first.rows.map((row) => row.donationID)
        )
    })

    test('ignores the export timestamp when computing IDs', async () => {
        const text = await loadSample('sample.csv')
        const original = await parseDonorDriveExport(text)
        const reExported = await parseDonorDriveExport(
            text.replace(
                'Date: 11/04/2026 5:25 PM ',
                'Date: 01/01/2030 1:00 AM '
            )
        )
        expect(reExported.rows.map((row) => row.donationID)).toEqual(
            original.rows.map((row) => row.donationID)
        )
    })

    test('rejects an unexpected header', async () => {
        expect(await parseDonorDriveExport('x\ny\n\nName,Amount\n')).toEqual({
            rows: [],
            errors: [{ line: 4, message: 'unexpected header' }],
        })
    })

    test('reports a bad row and keeps the valid rows', async () => {
        const text = (await loadSample('sample.csv')).replace('25.00', 'abc')
        const { rows, errors } = await parseDonorDriveExport(text)
        expect(errors.length).toBe(1)
        expect(errors[0]?.line).toBe(5)
        expect(rows.length).toBe(6)
    })

    test('reports a wrong field count', async () => {
        const text = (await loadSample('sample.csv')).replace(
            ',Private\r\nAnonymous',
            '\r\nAnonymous'
        )
        const { errors } = await parseDonorDriveExport(text)
        expect(errors).toEqual([
            { line: 6, message: 'expected 8 fields, got 7' },
        ])
    })

    test('parses the 10-column export and ignores the incentive columns', async () => {
        const { rows, errors } = await parseDonorDriveExport(
            await loadSample('sample-incentive.csv')
        )
        expect(errors).toEqual([])
        expect(rows.length).toBe(2)
        expect(rows[0]).toMatchObject({
            year: 2022,
            amount: 20,
            message: 'spin it',
        })
        expect(Object.keys(rows[0] ?? {})).not.toContain('incentive')

        const eightColumn = await parseDonorDriveExport(
            EIGHT_COLUMN_INCENTIVE_ROWS
        )
        expect(rows.map((row) => row.donationID)).toEqual(
            eightColumn.rows.map((row) => row.donationID)
        )
    })

    test('reports an 8-column row in a 10-column file', async () => {
        const text = (await loadSample('sample-incentive.csv')).replace(
            ',Spin the Wheel!,',
            ''
        )
        const { errors } = await parseDonorDriveExport(text)
        expect(errors).toEqual([
            { line: 5, message: 'expected 10 fields, got 8' },
        ])
    })
})

const row = (overrides: Partial<ExportDonationRow>): ExportDonationRow => ({
    year: 2019,
    donationID: 'csv:x',
    amount: 1,
    createdAt: 0,
    isRegFee: false,
    source: 'csv',
    ...overrides,
})

describe('fillMissingAmounts', () => {
    test('splits the 2019 gap evenly across the missing rows', () => {
        const known = Array.from({ length: 12 }, (_, index) =>
            row({ donationID: `csv:known${index}`, amount: 25 })
        )
        const rows = [
            ...known,
            row({ donationID: 'csv:known12', amount: 71 }),
            row({
                donationID: 'csv:missing1',
                amount: undefined,
                createdAt: 1000,
            }),
            row({
                donationID: 'csv:missing2',
                amount: undefined,
                createdAt: 2000,
            }),
        ]
        const result = fillMissingAmounts(rows, { 2019: 392.9 })
        expect(result.errors).toEqual([])
        const filled = result.rows.filter((r) =>
            r.donationID.startsWith('csv:missing')
        )
        expect(filled.map((r) => r.amount)).toEqual([10.95, 10.95])
        const totalCents = result.rows.reduce(
            (sum, r) => sum + Math.round(r.amount * 100),
            0
        )
        expect(totalCents).toBe(39290)
    })

    test('gives the leftover cent to the earliest row', () => {
        const rows = [
            row({
                year: 2020,
                donationID: 'csv:late',
                amount: undefined,
                createdAt: 2000,
            }),
            row({
                year: 2020,
                donationID: 'csv:early',
                amount: undefined,
                createdAt: 1000,
            }),
        ]
        const result = fillMissingAmounts(rows, { 2020: 10.01 })
        expect(result.errors).toEqual([])
        expect(
            result.rows.find((r) => r.donationID === 'csv:early')?.amount
        ).toBe(5.01)
        expect(
            result.rows.find((r) => r.donationID === 'csv:late')?.amount
        ).toBe(5)
    })

    test('passes through years without missing amounts', () => {
        const input = {
            ...row({ year: 2024, donationID: 'csv:a' }),
            amount: 25,
        }
        expect(fillMissingAmounts([input], {})).toEqual({
            rows: [input],
            errors: [],
        })
    })

    test('reports a missing amount with no known total', () => {
        const result = fillMissingAmounts(
            [row({ year: 2018, donationID: 'csv:a', amount: undefined })],
            {}
        )
        expect(result.errors).toEqual([
            '2018: 1 row(s) have no amount and no known total',
        ])
        expect(result.rows).toEqual([])
    })

    test('reports known amounts that exceed the known total', () => {
        const result = fillMissingAmounts(
            [
                row({ donationID: 'csv:a', amount: 10 }),
                row({ donationID: 'csv:b', amount: 10 }),
                row({ donationID: 'csv:c', amount: undefined }),
            ],
            { 2019: 10 }
        )
        expect(result.errors).toEqual([
            '2019: known amounts 20.00 exceed known total 10.00',
        ])
    })

    test('drops an errored year while another year still fills', () => {
        const rows = [
            row({ year: 2019, donationID: 'csv:a19', amount: 10 }),
            row({ year: 2019, donationID: 'csv:m19', amount: undefined }),
            row({ year: 2020, donationID: 'csv:a20', amount: 10 }),
            row({ year: 2020, donationID: 'csv:b20', amount: 10 }),
            row({ year: 2020, donationID: 'csv:m20', amount: undefined }),
        ]
        const result = fillMissingAmounts(rows, { 2019: 25, 2020: 10 })
        expect(result.errors).toEqual([
            '2020: known amounts 20.00 exceed known total 10.00',
        ])
        expect(result.rows.map((r) => [r.donationID, r.amount])).toEqual([
            ['csv:a19', 10],
            ['csv:m19', 15],
            ['csv:a20', 10],
            ['csv:b20', 10],
        ])
    })

    test('keeps the input order', () => {
        const rows = [
            row({ donationID: 'csv:3', amount: undefined, createdAt: 3 }),
            row({ donationID: 'csv:1', amount: 5, createdAt: 1 }),
            row({ donationID: 'csv:2', amount: undefined, createdAt: 2 }),
        ]
        const result = fillMissingAmounts(rows, { 2019: 15 })
        expect(result.rows.map((r) => r.donationID)).toEqual([
            'csv:3',
            'csv:1',
            'csv:2',
        ])
    })
})
