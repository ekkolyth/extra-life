import { parseArgs } from 'node:util'
import { Glob } from 'bun'
import {
    type ExportDonationRow,
    fillMissingAmounts,
    parseDonorDriveExport,
} from '../convex/lib/donordriveExport'

// DonorDrive shows 2019 raised $392.90; its export hides two amounts
const knownYearTotals: Record<number, number> = { 2019: 392.9 }

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

const insertRows = async (rows: object[], prod: boolean): Promise<number> => {
    const stdout = await runConvex([
        'run',
        'syncStore:insertDonations',
        JSON.stringify({ rows }),
        ...(prod ? ['--prod'] : []),
    ])
    return (JSON.parse(stdout) as { inserted: number }).inserted
}

const importDirectory = async (dir: string, prod: boolean) => {
    const parsed: ExportDonationRow[] = []
    let failed = false
    for (const file of new Glob('*.csv').scanSync(dir)) {
        const { rows, errors } = await parseDonorDriveExport(
            await Bun.file(`${dir}/${file}`).text()
        )
        for (const error of errors) {
            console.error(`${file}:${error.line} ${error.message}`)
            failed = true
        }
        parsed.push(...rows)
    }
    if (failed) process.exit(1)

    const unique = [
        ...new Map(parsed.map((row) => [row.donationID, row])).values(),
    ]
    const { rows, errors } = fillMissingAmounts(unique, knownYearTotals)
    if (errors.length > 0) {
        for (const error of errors) console.error(error)
        process.exit(1)
    }

    const years = [...new Set(rows.map((row) => row.year))].sort()
    console.log('year\tparsed\tinserted\tskipped')
    for (const year of years) {
        const yearRows = rows.filter((row) => row.year === year)
        const inserted = await insertRows(yearRows, prod)
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
        '10000',
        '--format',
        'jsonLines',
    ])
    const rows = stdout
        .split('\n')
        .filter((line) => line.startsWith('{'))
        .map((line) => JSON.parse(line) as Record<string, unknown>)
        .filter((row) => row.year === year)
        .map(({ _id, _creationTime, ...row }) => row)
    const inserted = await insertRows(rows, false)
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

if (values['copy-year'] !== undefined) {
    await copyYearFromProd(Number(values['copy-year']))
} else if (positionals[0]) {
    await importDirectory(positionals[0], values.prod ?? false)
} else {
    console.error(
        'usage: import-donation-csv.ts <dir> [--prod] | --copy-year <year>'
    )
    process.exit(1)
}
