import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { z } from 'zod'

dayjs.extend(utc)
dayjs.extend(timezone)

const SHARED_HEADER = [
    'Name',
    'Show Name',
    'Amount',
    'Show Amount',
    'Date/Time (ET)',
    'Email',
    'Message',
    'Show Message',
]
// the 2021–2023 exports append these; they are not imported
const INCENTIVE_HEADER = [...SHARED_HEADER, 'Incentive', 'Fulfillment Note']
const ACCEPTED_HEADERS = [SHARED_HEADER.join(','), INCENTIVE_HEADER.join(',')]
// title line, export timestamp line, blank line
const PREAMBLE_RECORDS = 3
const EXPORT_TIMEZONE = 'America/New_York'
const DATE_TIME_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{1,2}):(\d{2})(AM|PM)$/

const visibilitySchema = z.enum(['Public', 'Private'])

const exportRecordSchema = z.object({
    name: z.string(),
    showName: visibilitySchema,
    amount: z.union([
        z.literal('Anonymous'),
        z.string().regex(/^[\d,]+(\.\d{1,2})?$/, 'not a dollar amount'),
    ]),
    showAmount: visibilitySchema,
    dateTime: z.string().regex(DATE_TIME_PATTERN, 'expected MM/DD/YYYY h:mmAM'),
    email: z.string(),
    message: z.string(),
    showMessage: visibilitySchema,
})

type ExportDonationRow = {
    year: number
    donationID: string
    amount: number | undefined
    displayName?: string
    message?: string
    email?: string
    createdAt: number
    isRegFee: false
    source: 'csv'
}

type ExportParseError = { line: number; message: string }

type CsvRecord = { line: number; fields: string[] }

// a quote opens a quoted field only at the field's start; a bare quote mid-field is literal text
const readCsvRecords = (text: string): CsvRecord[] => {
    const records: CsvRecord[] = []
    let fields: string[] = []
    let field = ''
    let inQuotes = false
    let line = 1
    let recordLine = 1
    for (let i = 0; i < text.length; i++) {
        const char = text[i]
        if (inQuotes) {
            if (char === '"' && text[i + 1] === '"') {
                field += '"'
                i++
            } else if (char === '"') {
                inQuotes = false
            } else {
                if (char === '\n') line++
                field += char
            }
            continue
        }
        if (char === '"' && field === '') {
            inQuotes = true
        } else if (char === ',') {
            fields.push(field)
            field = ''
        } else if (char === '\n' || char === '\r') {
            if (char === '\r' && text[i + 1] === '\n') i++
            fields.push(field)
            records.push({ line: recordLine, fields })
            fields = []
            field = ''
            line++
            recordLine = line
        } else {
            field += char
        }
    }
    if (field !== '' || fields.length > 0) {
        fields.push(field)
        records.push({ line: recordLine, fields })
    }
    return records
}

const toUtcMillis = (dateTime: string): number => {
    const match = DATE_TIME_PATTERN.exec(dateTime)
    if (!match) throw new Error(`Unparseable export date: ${dateTime}`)
    const [, month, day, year, hour12, minute, meridiem] = match
    const hour = (Number(hour12) % 12) + (meridiem === 'PM' ? 12 : 0)
    const local = `${year}-${month}-${day} ${String(hour).padStart(2, '0')}:${minute}`
    return dayjs.tz(local, EXPORT_TIMEZONE).valueOf()
}

const sha256Hex = async (input: string): Promise<string> => {
    const digest = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(input)
    )
    return Array.from(new Uint8Array(digest), (byte) =>
        byte.toString(16).padStart(2, '0')
    ).join('')
}

const parseDonorDriveExport = async (
    text: string
): Promise<{ rows: ExportDonationRow[]; errors: ExportParseError[] }> => {
    const records = readCsvRecords(text.replace(/^﻿/, ''))
    const header = records[PREAMBLE_RECORDS]
    if (!header || !ACCEPTED_HEADERS.includes(header.fields.join(','))) {
        return {
            rows: [],
            errors: [
                { line: PREAMBLE_RECORDS + 1, message: 'unexpected header' },
            ],
        }
    }

    const rows: ExportDonationRow[] = []
    const errors: ExportParseError[] = []
    const occurrences = new Map<string, number>()

    for (const record of records.slice(PREAMBLE_RECORDS + 1)) {
        if (record.fields.length === 1 && record.fields[0] === '') continue
        if (record.fields.length !== header.fields.length) {
            errors.push({
                line: record.line,
                message: `expected ${header.fields.length} fields, got ${record.fields.length}`,
            })
            continue
        }
        const [
            name,
            showName,
            amount,
            showAmount,
            dateTime,
            email,
            message,
            showMessage,
        ] = record.fields
        const result = exportRecordSchema.safeParse({
            name,
            showName,
            amount,
            showAmount,
            dateTime,
            email,
            message,
            showMessage,
        })
        if (!result.success) {
            errors.push({
                line: record.line,
                message: result.error.issues
                    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
                    .join('; '),
            })
            continue
        }

        const parsed = result.data
        const key = `${parsed.dateTime}|${parsed.name}|${parsed.amount}`
        const occurrence = occurrences.get(key) ?? 0
        occurrences.set(key, occurrence + 1)
        const year = Number(parsed.dateTime.slice(6, 10))
        const hash = await sha256Hex(`${year}|${key}|${occurrence}`)

        const row: ExportDonationRow = {
            year,
            donationID: `csv:${hash.slice(0, 16)}`,
            amount:
                parsed.amount === 'Anonymous'
                    ? undefined
                    : Number(parsed.amount.replaceAll(',', '')),
            createdAt: toUtcMillis(parsed.dateTime),
            isRegFee: false,
            source: 'csv',
        }
        if (parsed.showName === 'Public') row.displayName = parsed.name
        if (parsed.showMessage === 'Public' && parsed.message !== '')
            row.message = parsed.message
        if (parsed.email !== '' && parsed.email !== 'Anonymous')
            row.email = parsed.email
        rows.push(row)
    }

    return { rows, errors }
}

export type { ExportDonationRow, ExportParseError }
export { parseDonorDriveExport }
