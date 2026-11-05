import { parseArgs } from 'node:util'
import { Glob } from 'bun'
import { z } from 'zod'
import {
    type ExportDonationRow,
    fillMissingAmounts,
    parseDonorDriveExport,
} from '../convex/lib/donordriveExport'

const COPY_ROW_LIMIT = 10000

const insertResultSchema = z.object({ inserted: z.number() })
const copyRowSchema = z.record(z.string(), z.unknown())

// DonorDrive shows 2019 raised $392.90; its export hides two amounts
const KNOWN_YEAR_TOTALS: Record<number, number> = { 2019: 392.9 }

const runConvex = async (args: string[]): Promise<string> => {
    const child = Bun.spawn(['bunx', 'convex', ...args], {
        stdout: 'pipe',
        stderr: 'pipe',
    })
    const [stdout, stderr, exitCode] = await Promise.all([
        new Response(child.stdout).text(),
        new Response(child.stderr).text(),
        child.exited,
    ])
    if (exitCode !== 0) {
        console.error(stderr)
        process.exit(exitCode)
    }
    return stdout
}

const insertRows = async (
    rows: object[],
    prod: boolean,
    year: number
): Promise<number> => {
    const stdout = await runConvex([
        'run',
        'syncStore:insertDonations',
        JSON.stringify({ rows }),
        ...(prod ? ['--prod'] : []),
    ])
    const result = insertResultSchema.safeParse(JSON.parse(stdout))
    if (!result.success) {
        console.error(
            `${year}: syncStore:insertDonations returned an unexpected result: ${result.error.message}`
        )
        process.exit(1)
    }
    return result.data.inserted
}

const importDirectory = async (dir: string, prod: boolean) => {
    const parsed: ExportDonationRow[] = []
    let failed = false
    let fileCount = 0
    for (const file of new Glob('*.csv').scanSync(dir)) {
        fileCount++
        const { rows, errors } = await parseDonorDriveExport(
            await Bun.file(`${dir}/${file}`).text()
        )
        for (const error of errors) {
            console.error(`${file}:${error.line} ${error.message}`)
            failed = true
        }
        parsed.push(...rows)
    }
    if (fileCount === 0) {
        console.error(`no CSV files in ${dir}`)
        process.exit(1)
    }
    if (failed) process.exit(1)

    const unique = [
        ...new Map(parsed.map((row) => [row.donationID, row])).values(),
    ]
    const { rows, errors } = fillMissingAmounts(unique, KNOWN_YEAR_TOTALS)
    if (errors.length > 0) {
        for (const error of errors) console.error(error)
        process.exit(1)
    }

    const years = [...new Set(rows.map((row) => row.year))].sort()
    console.log('year\tparsed\tinserted\tskipped')
    for (const year of years) {
        const yearRows = rows.filter((row) => row.year === year)
        const inserted = await insertRows(yearRows, prod, year)
        console.log(
            `${year}\t${yearRows.length}\t${inserted}\t${yearRows.length - inserted}`
        )
    }
}

const copyYearFromProd = async (year: number) => {
    const stdout = await runConvex([
        'data',
        'donations',
        '--prod',
        '--limit',
        String(COPY_ROW_LIMIT),
        '--format',
        'jsonLines',
    ])
    const parsedRows = stdout
        .split('\n')
        .filter((line) => line.startsWith('{'))
        .map((line) => {
            const result = copyRowSchema.safeParse(JSON.parse(line))
            if (!result.success) {
                console.error(
                    `${year}: convex data donations returned an unexpected row: ${result.error.message}`
                )
                process.exit(1)
            }
            return result.data
        })
    if (parsedRows.length >= COPY_ROW_LIMIT) {
        console.error(
            `${year}: convex data donations returned ${parsedRows.length} rows, the --limit; the export may be truncated`
        )
        process.exit(1)
    }
    const rows = parsedRows
        .filter((row) => row.year === year)
        .map(({ _id, _creationTime, ...row }) => row)
    const inserted = await insertRows(rows, false, year)
    console.log(
        `${year}\tcopied ${rows.length}\tinserted ${inserted}\tskipped ${rows.length - inserted}`
    )
}

const { values, positionals } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
        prod: { type: 'boolean', default: false },
        'copy-year': { type: 'string' },
    },
    allowPositionals: true,
})

const USAGE =
    'usage: import-donation-csv.ts <dir> [--prod] | --copy-year <year>'

if (values['copy-year'] !== undefined) {
    const year = Number(values['copy-year'])
    if (!Number.isInteger(year)) {
        console.error(USAGE)
        process.exit(1)
    }
    if (values.prod) {
        console.error('--copy-year always writes to dev; drop --prod')
        process.exit(1)
    }
    await copyYearFromProd(year)
} else if (positionals[0]) {
    await importDirectory(positionals[0], values.prod ?? false)
} else {
    console.error(USAGE)
    process.exit(1)
}
