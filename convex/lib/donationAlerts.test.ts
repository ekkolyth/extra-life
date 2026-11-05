import { describe, expect, test } from 'bun:test'
import {
    ALERT_MAX_AGE_MS,
    ALERT_MIN_AMOUNT,
    shouldQueueAlert,
} from './donationAlerts'

const now = Date.parse('2026-11-07T20:00:00Z')

describe('shouldQueueAlert', () => {
    test('queues a big donation that is older than the old 15s overlay window', () => {
        expect(
            shouldQueueAlert(
                { amount: ALERT_MIN_AMOUNT, createdAt: now - 45_000 },
                now
            )
        ).toBe(true)
    })

    test('skips donations under the threshold', () => {
        expect(
            shouldQueueAlert(
                { amount: ALERT_MIN_AMOUNT - 0.01, createdAt: now },
                now
            )
        ).toBe(false)
    })

    test('skips donations from a history re-sync', () => {
        expect(
            shouldQueueAlert(
                { amount: 500, createdAt: now - ALERT_MAX_AGE_MS - 1 },
                now
            )
        ).toBe(false)
    })

    test('queues a donation exactly at the age limit', () => {
        expect(
            shouldQueueAlert(
                { amount: 500, createdAt: now - ALERT_MAX_AGE_MS },
                now
            )
        ).toBe(true)
    })
})
