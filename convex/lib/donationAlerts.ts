const ALERT_MIN_AMOUNT = 100
// a re-sync of a campaign's history must not queue an alert for every old donation
const ALERT_MAX_AGE_MS = 10 * 60 * 1000

function shouldQueueAlert(
    donation: { amount: number; createdAt: number },
    now: number
): boolean {
    return (
        donation.amount >= ALERT_MIN_AMOUNT &&
        now - donation.createdAt <= ALERT_MAX_AGE_MS
    )
}

export { ALERT_MAX_AGE_MS, ALERT_MIN_AMOUNT, shouldQueueAlert }
