import axios from 'axios'

export const fetchStats = async (id: string) => {
  return await axios.get(`https://extra-life.org/api/participants/${id}`).then(res => res.data)
}

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

export const percentage = (donations: number, goal: number) => Math.floor((donations / goal) * 100)

export const fetchTopDonor = async (id: string) => {
  return await axios
    .get(
      `https://extra-life.org/api/participants/${id}/donors?limit=1&orderBy=sumDonations%20DESC&where=amountVisibility%20%3D%20ALL%20AND%20sumDonations%20%3E%200`
    )
    .then(res => res.data[0])
}

export const fetchTopDonation = async (id: string) => {
  return await axios
    .get(`https://extra-life.org/api/participants/${id}/donations?limit=1&orderBy=amount%20DESC`)
    .then(res => res.data[0])
}

export const fetchWheelSpinDonations = async (id: string) => {
  return await axios
    .get(`https://extra-life.org/api/participants/${id}/donations?limit=100`)
    .then(res => res.data)
    .then(data => data.filter((d: { amount: number }) => d.amount > 20.22))
}