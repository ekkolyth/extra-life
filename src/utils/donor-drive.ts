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
  donorID: string
  links: {
    recipient: string
  }
  eventID: number
  createdDateUTC: string
  recipientName: string
  message: string | null
  participantID: number
  amount: number
  donorIsRecipient: boolean
  avatarImageURL: string
  teamID: number
  donationID: string
}

export const fetchStats = async (id: string) => {
  return (await fetch(`https://extra-life.org/api/participants/${id}`).then(res => res.json())) as StatsResult
}

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

export const percentage = (donations: number, goal: number) => Math.floor((donations / goal) * 100)

export const fetchTopDonor = async (id: string) => {
  return (await fetch(
    `https://extra-life.org/api/participants/${id}/donors?limit=1&orderBy=sumDonations%20DESC&where=amountVisibility%20%3D%20ALL%20AND%20sumDonations%20%3E%200`
  )
    .then(res => res.json())
    .then(json => json[0])) as Donor
}

export const fetchTopDonation = async (id: string) => {
  return (await fetch(`https://extra-life.org/api/participants/${id}/donations?limit=1&orderBy=amount%20DESC`)
    .then(res => res.json())
    .then(json => json[0])) as Donation
}

export const fetchLatestDonations = async (id: string, limit: number) => {
  return (await fetch(
    `https://extra-life.org/api/participants/${id}/donations?limit=${limit}&orderBy=createdDateUTC%20DESC`
  ).then(res => res.json())) as Donation[]
}

export const fetchWheelSpinDonations = async (id: string) => {
  return (await fetch(`https://extra-life.org/api/participants/${id}/donations?limit=100&orderBy=amount%20DESC`)
    .then(res => res.json())
    .then(data => data.filter((d: { amount: number }) => d.amount >= 20 && d.amount <= 99.99))) as Donation[]
}

export const fetchBigWheelSpinDonations = async (id: string) => {
  return (await fetch(`https://extra-life.org/api/participants/${id}/donations?limit=100&orderBy=amount%20DESC`)
    .then(res => res.json())
    .then(data => data.filter((d: { amount: number }) => d.amount >= 100))) as Donation[]
}
