const DONORDRIVE_BASE_URL = 'https://dd.extra-life.org/api'
const DONORDRIVE_VERSION = '1.3'
const DEFAULT_RATE_LIMIT_BLOCK_MS = 300_000

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>

type DonorDriveResponse =
    | { kind: 'ok'; status: 200; body: unknown; etag?: string }
    | { kind: 'not-modified'; status: 304 }
    | { kind: 'rate-limited'; status: 429; retryAfterMs: number }
    | { kind: 'error'; status?: number; message: string }

const buildUrl = (path: string, params: Record<string, string>): string => {
    const searchParams = new URLSearchParams({
        version: DONORDRIVE_VERSION,
        ...params,
    })
    return `${DONORDRIVE_BASE_URL}${path}?${searchParams.toString()}`
}

const retryAfterMs = (response: Response): number => {
    const header = response.headers.get('Retry-After')
    if (!header) return DEFAULT_RATE_LIMIT_BLOCK_MS
    const seconds = Number(header)
    return Number.isFinite(seconds) && seconds >= 0
        ? seconds * 1000
        : DEFAULT_RATE_LIMIT_BLOCK_MS
}

const getDonorDrive = async (
    path: string,
    params: Record<string, string>,
    etag: string | undefined,
    fetchImpl: FetchLike = fetch
): Promise<DonorDriveResponse> => {
    const url = buildUrl(path, params)
    let response: Response
    try {
        response = await fetchImpl(
            url,
            etag ? { headers: { 'If-None-Match': etag } } : undefined
        )
    } catch (error) {
        return {
            kind: 'error',
            message: error instanceof Error ? error.message : String(error),
        }
    }

    if (response.status === 304) return { kind: 'not-modified', status: 304 }
    if (response.status === 429)
        return {
            kind: 'rate-limited',
            status: 429,
            retryAfterMs: retryAfterMs(response),
        }
    if (response.status !== 200)
        return {
            kind: 'error',
            status: response.status,
            message: `DonorDrive returned ${response.status}`,
        }

    let text: string
    try {
        text = await response.text()
    } catch (error) {
        return {
            kind: 'error',
            status: response.status,
            message: error instanceof Error ? error.message : String(error),
        }
    }

    try {
        const body: unknown = JSON.parse(text)
        const etagHeader = response.headers.get('ETag')
        return etagHeader
            ? { kind: 'ok', status: 200, body, etag: etagHeader }
            : { kind: 'ok', status: 200, body }
    } catch {
        return {
            kind: 'error',
            status: 200,
            message: 'Invalid JSON response',
        }
    }
}

export type { DonorDriveResponse, FetchLike }
export { getDonorDrive }
