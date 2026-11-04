import { describe, expect, test } from 'bun:test'
import { parseDonorDriveExport } from './donordriveExport'

const loadSample = (name: string) =>
    Bun.file(
        new URL(
            `../../testdata/contracts/donordrive-export/${name}`,
            import.meta.url
        )
    ).text()

const EIGHT_COLUMN_INCENTIVE_ROWS =
    '﻿Sample_Participant - Donor Export\nDate: 11/04/2026 5:25 PM \n\nName,Show Name,Amount,Show Amount,Date/Time (ET),Email,Message,Show Message\nWheel Fan,Public,20.00,Public,11/05/2022 8:00PM,wheel.fan@example.com,spin it,Public\r\nPlain Donor,Public,15.00,Public,11/05/2022 7:00PM,plain@example.com,,Public'

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
