function pad(value: number) {
    return String(value).padStart(2, '0')
}

// stops at zero once the end time has passed
export function formatTimeLeft(remainingMs: number) {
    const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000))
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`
}
