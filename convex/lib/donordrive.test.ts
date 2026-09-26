import { describe, expect, test } from 'bun:test'
import {
    DONORDRIVE_PAGE_SIZE,
    donationSchema,
    donorSchema,
    hasMorePages,
    parseDonorDriveDate,
    parseRecords,
    participantSchema,
    splitPage,
    toCampaignFields,
    toDonationRow,
    toDonorRow,
} from './donordrive'

const loadSample = (name: string) =>
    Bun.file(
        new URL(`../../testdata/contracts/donordrive/${name}`, import.meta.url)
    ).json()

describe('participantSchema / toCampaignFields', () => {
    test('parses the frozen participant sample', async () => {
        const sample = await loadSample('participant.json')
        const participant = participantSchema.parse(sample)
        const fields = toCampaignFields(participant)
        expect(fields.eventId).toBe(562)
        expect(fields.eventName).toBe('Extra Life 2026')
    })
})

describe('donationSchema / toDonationRow', () => {
    test('parses the frozen donations sample and maps the first record', async () => {
        const sample = await loadSample('donations.json')
        const { records, errors } = parseRecords(donationSchema, sample)
        expect(records.length).toBeGreaterThanOrEqual(1)
        expect(errors).toEqual([])

        const first = records[0]
        const row = toDonationRow(first, {
            year: 2026,
            participantId: '567267',
        })
        expect(row).not.toBeNull()
        expect(row?.source).toBe('api')
        expect(row?.donationID).toBe(first.donationID)
        expect(row?.createdAt).toBe(Date.parse(first.createdDateUTC as string))
    })
})

describe('donorSchema / toDonorRow', () => {
    test('parses the frozen donors sample and maps modifiedAt', async () => {
        const sample = await loadSample('donors.json')
        const { records } = parseRecords(donorSchema, sample)
        expect(records.length).toBeGreaterThanOrEqual(1)

        const first = records[0]
        const row = toDonorRow(first, 2026)
        expect(row).not.toBeNull()
        const normalized = (first.modifiedDateUTC as string).replace(
            /([+-]\d{2})(\d{2})$/,
            '$1:$2'
        )
        expect(row?.modifiedAt).toBe(Date.parse(normalized))
    })
})

describe('parseDonorDriveDate', () => {
    test('parses a Z-suffixed date', () => {
        expect(parseDonorDriveDate('2026-07-30T01:00:04.637Z')).toBe(
            1785373204637
        )
    })

    test('parses a +0000-suffixed date', () => {
        expect(parseDonorDriveDate('2026-07-30T01:00:04.637+0000')).toBe(
            1785373204637
        )
    })

    test('throws on an unparseable date', () => {
        expect(() => parseDonorDriveDate('nope')).toThrow(
            'Unparseable DonorDrive date: nope'
        )
    })
})

describe('parseRecords', () => {
    const validDonation = {
        donationID: 'abc123',
        createdDateUTC: '2026-07-30T01:00:04.637Z',
        amount: 25,
    }

    test('skips a donation with an unparseable date and records the error', () => {
        const { records, errors } = parseRecords(donationSchema, [
            { ...validDonation, createdDateUTC: 'nope' },
        ])
        expect(records.length).toBe(0)
        expect(errors.length).toBe(1)
        expect(errors[0]).toContain('date')
    })

    test('skips a donor with an unparseable date and records the error', () => {
        const { records, errors } = parseRecords(donorSchema, [
            {
                donorID: 'd1',
                avatarImageURL: '',
                modifiedDateUTC: 'nope',
                sumDonations: 0,
                numDonations: 0,
            },
        ])
        expect(records.length).toBe(0)
        expect(errors.length).toBe(1)
        expect(errors[0]).toContain('date')
    })

    test('collects one record and one error for a mixed array', () => {
        const { records, errors, pageLength } = parseRecords(donationSchema, [
            { amount: 'x' },
            validDonation,
        ])
        expect(records.length).toBe(1)
        expect(errors.length).toBe(1)
        expect(errors[0]).toContain('amount')
        expect(pageLength).toBe(2)
    })

    test('returns zero records and one error when body is not an array', () => {
        const { records, errors, pageLength } = parseRecords(donationSchema, {
            not: 'an array',
        })
        expect(records).toEqual([])
        expect(errors.length).toBe(1)
        expect(pageLength).toBe(0)
    })

    test('pageLength reflects the raw array length even with a bad record', () => {
        const { records, pageLength } = parseRecords(donationSchema, [
            { amount: 'x' },
            validDonation,
            validDonation,
        ])
        expect(pageLength).toBe(3)
        expect(records.length).toBe(2)
    })
})

describe('toDonationRow', () => {
    const base = {
        donationID: 'abc123',
        createdDateUTC: '2026-07-30T01:00:04.637Z',
        amount: 25,
    }
    const scope = { year: 2026, participantId: '567267' }

    test('returns null when donationID is missing', () => {
        const { donationID, ...rest } = base
        expect(toDonationRow(rest as never, scope)).toBeNull()
    })

    test('returns null when createdDateUTC is missing', () => {
        const { createdDateUTC, ...rest } = base
        expect(toDonationRow(rest as never, scope)).toBeNull()
    })

    test('omits message when message is null', () => {
        const row = toDonationRow({ ...base, message: null }, scope)
        expect(row).not.toBeNull()
        expect(row && 'message' in row).toBe(false)
    })
})

describe('toDonorRow', () => {
    test('returns null when donorID is missing', () => {
        expect(
            toDonorRow(
                {
                    avatarImageURL: '',
                    modifiedDateUTC: '2026-07-30T01:00:04.637Z',
                    sumDonations: 0,
                    numDonations: 0,
                },
                2026
            )
        ).toBeNull()
    })
})

describe('hasMorePages', () => {
    test('full page with a fresh row continues', () => {
        expect(hasMorePages(DONORDRIVE_PAGE_SIZE, 1, false)).toBe(true)
    })

    test('full page with no fresh rows and no recovery stops', () => {
        expect(hasMorePages(DONORDRIVE_PAGE_SIZE, 0, false)).toBe(false)
    })

    test('full page with no fresh rows continues during recovery', () => {
        expect(hasMorePages(DONORDRIVE_PAGE_SIZE, 0, true)).toBe(true)
    })

    test('short page stops even during recovery', () => {
        expect(hasMorePages(37, 5, true)).toBe(false)
    })
})

describe('splitPage', () => {
    const rows = [{ donationID: 'a' }, { donationID: 'b' }, { donationID: 'c' }]

    test('splits fresh from known and reports hitKnown', () => {
        const { fresh, hitKnown } = splitPage(rows, new Set(['c']))
        expect(fresh.map((r) => r.donationID)).toEqual(['a', 'b'])
        expect(hitKnown).toBe(true)
    })

    test('everything is fresh when no ids are known', () => {
        const { fresh, hitKnown } = splitPage(rows, new Set())
        expect(fresh.map((r) => r.donationID)).toEqual(['a', 'b', 'c'])
        expect(hitKnown).toBe(false)
    })
})

describe('paging simulation (spec check 5)', () => {
    const makeIds = (count: number, offset: number) =>
        Array.from({ length: count }, (_, i) => `id-${offset + i}`).map(
            (donationID) => ({ donationID })
        )

    const runPaging = (
        pages: { donationID: string }[][],
        known: Set<string>,
        recoverAll: boolean
    ) => {
        const collected: string[] = []
        let pagesFetched = 0
        for (const page of pages) {
            pagesFetched++
            const { fresh } = splitPage(page, known)
            collected.push(...fresh.map((r) => r.donationID))
            if (!hasMorePages(page.length, fresh.length, recoverAll)) break
        }
        return { collected, pagesFetched }
    }

    test('a known id mid-page no longer stops paging', () => {
        const page1 = makeIds(100, 0)
        const page2 = makeIds(100, 100)
        const knownId = page2[50].donationID
        const pages = [page1, page2, makeIds(37, 200)]

        const { collected, pagesFetched } = runPaging(
            pages,
            new Set([knownId]),
            false
        )

        expect(collected.length).toBe(236)
        expect(pagesFetched).toBe(3)
    })

    test('recoverAll continues past an all-known page', () => {
        const pages = [makeIds(100, 0), makeIds(100, 100), makeIds(20, 200)]
        const known = new Set(pages[0].map((r) => r.donationID))

        const { collected, pagesFetched } = runPaging(pages, known, true)

        expect(collected.length).toBe(120)
        expect(pagesFetched).toBe(3)
    })

    test('without recoverAll, an all-known first page stops paging', () => {
        const pages = [makeIds(100, 0), makeIds(100, 100), makeIds(20, 200)]
        const known = new Set(pages[0].map((r) => r.donationID))

        const { collected, pagesFetched } = runPaging(pages, known, false)

        expect(collected.length).toBe(0)
        expect(pagesFetched).toBe(1)
    })
})
