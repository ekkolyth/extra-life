import { describe, expect, test } from 'bun:test'
import { type FetchLike, getDonorDrive } from './donordriveHttp'

describe('getDonorDrive', () => {
    test('returns ok with body and etag on 200', async () => {
        let recordedUrl: string | undefined
        let recordedHeaders: HeadersInit | undefined
        const fetchImpl: FetchLike = async (url, init) => {
            recordedUrl = url
            recordedHeaders = init?.headers
            return new Response(JSON.stringify({ hello: 'world' }), {
                status: 200,
                headers: { ETag: '"abc"' },
            })
        }

        const result = await getDonorDrive(
            '/participants/1/donations',
            { limit: '100', offset: '0' },
            undefined,
            fetchImpl
        )

        expect(recordedUrl).toBe(
            'https://dd.extra-life.org/api/participants/1/donations?version=1.3&limit=100&offset=0'
        )
        expect(recordedHeaders).toBeUndefined()
        expect(result).toEqual({
            kind: 'ok',
            status: 200,
            body: { hello: 'world' },
            etag: '"abc"',
        })
    })

    test('sends If-None-Match when etag is set', async () => {
        let recordedHeaders: HeadersInit | undefined
        const fetchImpl: FetchLike = async (_url, init) => {
            recordedHeaders = init?.headers
            return new Response(null, { status: 304 })
        }

        const result = await getDonorDrive(
            '/participants/1/donations',
            {},
            '"abc"',
            fetchImpl
        )

        expect(recordedHeaders).toEqual({ 'If-None-Match': '"abc"' })
        expect(result).toEqual({ kind: 'not-modified', status: 304 })
    })

    test('rate-limited with Retry-After header converts to ms', async () => {
        const fetchImpl: FetchLike = async () =>
            new Response(null, {
                status: 429,
                headers: { 'Retry-After': '30' },
            })

        const result = await getDonorDrive('/x', {}, undefined, fetchImpl)

        expect(result).toEqual({
            kind: 'rate-limited',
            status: 429,
            retryAfterMs: 30000,
        })
    })

    test('rate-limited without Retry-After header defaults to 300000ms', async () => {
        const fetchImpl: FetchLike = async () =>
            new Response(null, { status: 429 })

        const result = await getDonorDrive('/x', {}, undefined, fetchImpl)

        expect(result).toEqual({
            kind: 'rate-limited',
            status: 429,
            retryAfterMs: 300000,
        })
    })

    test('rate-limited with a negative Retry-After defaults to 300000ms', async () => {
        const fetchImpl: FetchLike = async () =>
            new Response(null, {
                status: 429,
                headers: { 'Retry-After': '-5' },
            })

        const result = await getDonorDrive('/x', {}, undefined, fetchImpl)

        expect(result).toEqual({
            kind: 'rate-limited',
            status: 429,
            retryAfterMs: 300000,
        })
    })

    test('rate-limited with a non-numeric Retry-After defaults to 300000ms', async () => {
        const fetchImpl: FetchLike = async () =>
            new Response(null, {
                status: 429,
                headers: { 'Retry-After': 'abc' },
            })

        const result = await getDonorDrive('/x', {}, undefined, fetchImpl)

        expect(result).toEqual({
            kind: 'rate-limited',
            status: 429,
            retryAfterMs: 300000,
        })
    })

    test('rate-limited with a zero Retry-After honours it', async () => {
        const fetchImpl: FetchLike = async () =>
            new Response(null, {
                status: 429,
                headers: { 'Retry-After': '0' },
            })

        const result = await getDonorDrive('/x', {}, undefined, fetchImpl)

        expect(result).toEqual({
            kind: 'rate-limited',
            status: 429,
            retryAfterMs: 0,
        })
    })

    test('500 returns an error with a fixed message', async () => {
        const fetchImpl: FetchLike = async () =>
            new Response(null, { status: 500 })

        const result = await getDonorDrive('/x', {}, undefined, fetchImpl)

        expect(result).toEqual({
            kind: 'error',
            status: 500,
            message: 'DonorDrive returned 500',
        })
    })

    test('200 with an unparseable body returns an error', async () => {
        const fetchImpl: FetchLike = async () =>
            new Response('<html>not json</html>', { status: 200 })

        const result = await getDonorDrive('/x', {}, undefined, fetchImpl)

        expect(result.kind).toBe('error')
        expect((result as { status?: number }).status).toBe(200)
        expect((result as { message: string }).message).toStartWith(
            'Invalid JSON'
        )
    })

    test('a body-read failure on 200 returns an error with the response status', async () => {
        const stream = new ReadableStream({
            async pull(controller) {
                controller.error(new TypeError('connection reset'))
            },
        })
        const fetchImpl: FetchLike = async () =>
            new Response(stream, { status: 200 })

        const result = await getDonorDrive('/x', {}, undefined, fetchImpl)

        expect(result).toEqual({
            kind: 'error',
            status: 200,
            message: 'connection reset',
        })
    })

    test('a thrown network error returns an error with no status', async () => {
        const fetchImpl: FetchLike = async () => {
            throw new TypeError('network down')
        }

        const result = await getDonorDrive('/x', {}, undefined, fetchImpl)

        expect(result).toEqual({ kind: 'error', message: 'network down' })
    })
})
