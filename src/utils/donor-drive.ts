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

export const fetchStats = async (id: string) => {
  if (isBlocked('fetchStats')) {
    return 'Rate limited'
  }

  const response = await fetch(`https://extra-life.org/api/participants/${id}`)

  if (response.status === 429) {
    blockedAt = new Date()
    console.log(`Rate limited. ${response.status}\n${await response.text()}`)
    return 'Rate limited'
  }

  const data = (await response.json()) as StatsResult

  return data
}

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

export const percentage = (donations: number, goal: number) => Math.floor((donations / goal) * 100)

export const fetchTopDonor = async (id: string) => {
  if (isBlocked('fetchTopDonor')) {
    return 'Rate limited'
  }

  const response = await fetch(
    `https://extra-life.org/api/participants/${id}/donors?limit=1&orderBy=sumDonations%20DESC&where=amountVisibility%20%3D%20ALL%20AND%20sumDonations%20%3E%200`
  )

  if (response.status === 429) {
    blockedAt = new Date()
    return 'Rate limited'
  }

  return (await response.json())[0] as Donor
}

export const fetchTopDonation = async (id: string) => {
  if (isBlocked('fetchTopDonation')) {
    return 'Rate limited'
  }

  const response = await fetch(`https://extra-life.org/api/participants/${id}/donations?limit=1&orderBy=amount%20DESC`)
  if (response.status === 429) {
    blockedAt = new Date()
    return 'Rate limited'
  }

  return (await response.json())[0] as Donation
}

export const fetchLatestDonations = async (id: string, limit: number) => {
  if (isBlocked('fetchLatestDonations')) {
    return 'Rate limited'
  }

  const response = await fetch(
    `https://extra-life.org/api/participants/${id}/donations?limit=${limit}&orderBy=createdDateUTC%20DESC`
  )

  if (response.status === 429) {
    blockedAt = new Date()
    return 'Rate limited'
  }

  return (await response.json()) as Donation[]
}

export const fetchWheelSpinDonations = async (id: string) => {
  if (isBlocked('fetchWheelSpinDonations')) {
    return 'Rate limited'
  }

  const response = await fetch(
    `https://extra-life.org/api/participants/${id}/donations?limit=100&orderBy=amount%20DESC`
  )

  if (response.status === 429) {
    blockedAt = new Date()
    console.log(`Rate limited. Waiting ${blockedAt}`)
    return 'Rate limited'
  }

  const json = await response.json()
  return json.filter((d: { amount: number }) => d.amount >= 20 && d.amount <= 99.99) as Donation[]
}

export const fetchBigWheelSpinDonations = async (id: string) => {
  if (isBlocked('fetchBigWheelSpinDonations')) {
    return 'Rate limited'
  }

  const response = await fetch(
    `https://extra-life.org/api/participants/${id}/donations?limit=100&orderBy=amount%20DESC`
  )

  if (response.status === 429) {
    blockedAt = new Date()
    return 'Rate limited'
  }

  const json = await response.json()
  return json.filter((d: { amount: number }) => d.amount >= 100) as Donation[]
}
