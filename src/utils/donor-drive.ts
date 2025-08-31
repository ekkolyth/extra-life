export type StatsResult = {
  avatarImageURL: string
  createdDateUTC: string
  displayName: string
  eventID: number
  eventName: string
  fundraisingGoal: number
  hasActivityTracking: boolean
  isCustomAvatarImage: boolean
  isTeamCaptain: boolean
  isTeamCoCaptain: boolean
  links: {
    donate: string
    page: string
    stream: string
  }
  numDonations: number
  numIncentives: number
  numMilestones: number
  participantID: number
  participantTypeCode: string
  role: string
  streamIsEnabled: boolean
  streamIsLive: boolean
  streamingChannel: string
  streamingPlatform: string
  sumDonations: number
  sumPledges: number
  teamID: number
  teamName: string
}

export type Donor = {
  displayName: string
  donorID: string
  avatarImageURL: string
  modifiedDateUTC: string
  sumDonations: number
  numDonations: number
}

export type Donation = {
  displayName: string
  donorID?: string
  links?: {
    recipient: string
  }
  eventID?: number
  createdDateUTC?: string
  recipientName?: string
  message?: string | null
  participantID?: number
  amount: number
  donorIsRecipient?: boolean
  avatarImageURL?: string
  teamID?: number
  donationID?: string
}

let blockedAt: Date | null = null

function isBlocked(id: string) {
  if (blockedAt === null) {
    return false
  }

  // 5 minutes
  const blockedTime = 5 * 60 * 1000
  const now = new Date().getTime()
  const blocked = new Date(blockedAt).getTime() + blockedTime

  const blockedTimestamp = Number(blocked)
  const blockedDate = new Date(blockedTimestamp * 1000) // Convert to milliseconds
  const humanReadableDate = blockedDate.toLocaleString() // Format to a human-readable string

  // Set blockedAt to null if the block has expired
  if (now >= blocked) {
    blockedAt = null
    return false
  }

  console.log(`Blocked until ${humanReadableDate}\nID: ${id}`)

  return now < blocked
}

const FIFTEEN_SECONDS = 15 * 1000

type CacheEntry = {
  timestamp: number
  data: any
}

const cache = new Map<string, CacheEntry>()

async function fetchWithCache<T>(key: string, url: string): Promise<T | 'Rate limited'> {
  const now = Date.now()
  const cached = cache.get(key)
  if (cached && now - cached.timestamp < FIFTEEN_SECONDS) {
    return cached.data as T
  }

  if (isBlocked(key)) {
    return 'Rate limited'
  }

  const response = await fetch(url)
  if (response.status === 429) {
    blockedAt = new Date()
    console.log(`Rate limited. ${response.status}\n${await response.text()}`)
    cache.set(key, { timestamp: now, data: 'Rate limited' })
    return 'Rate limited'
  }

  const data = (await response.json()) as T
  cache.set(key, { timestamp: now, data })
  return data
}

export const fetchStats = async (id: string) =>
  fetchWithCache<StatsResult>(`stats-${id}`, `https://extra-life.org/api/participants/${id}`)

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

export const percentage = (donations: number, goal: number) => Math.floor((donations / goal) * 100)

export const fetchTopDonor = async (id: string) => {
  const data = await fetchWithCache<Donor[]>(
    `topDonor-${id}`,
    `https://extra-life.org/api/participants/${id}/donors?limit=1&orderBy=sumDonations%20DESC&where=amountVisibility%20%3D%20ALL%20AND%20sumDonations%20%3E%200`
  )
  return Array.isArray(data) ? (data[0] as Donor) : data
}

export const fetchTopDonation = async (id: string) => {
  const data = await fetchWithCache<Donation[]>(
    `topDonation-${id}`,
    `https://extra-life.org/api/participants/${id}/donations?limit=1&orderBy=amount%20DESC`
  )
  return Array.isArray(data) ? (data[0] as Donation) : data
}

export const fetchLatestDonations = async (id: string, limit: number) =>
  fetchWithCache<Donation[]>(
    `latestDonations-${id}-${limit}`,
    `https://extra-life.org/api/participants/${id}/donations?limit=${limit}&orderBy=createdDateUTC%20DESC`
  )

export const fetchWheelSpinDonations = async (id: string) => {
  const data = await fetchWithCache<Donation[]>(
    `wheelSpins-${id}`,
    `https://extra-life.org/api/participants/${id}/donations?limit=100&orderBy=amount%20DESC`
  )
  return Array.isArray(data)
    ? (data.filter((d: { amount: number }) => d.amount >= 20 && d.amount <= 99.99) as Donation[])
    : data
}

export const fetchBigWheelSpinDonations = async (id: string) => {
  const data = await fetchWithCache<Donation[]>(
    `bigWheelSpins-${id}`,
    `https://extra-life.org/api/participants/${id}/donations?limit=100&orderBy=amount%20DESC`
  )
  return Array.isArray(data)
    ? (data.filter((d: { amount: number }) => d.amount >= 100) as Donation[])
    : data
}
