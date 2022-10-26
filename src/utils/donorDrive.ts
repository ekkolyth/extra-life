import axios from 'axios'

export const fetchStats = async (id: string) => {
  return await axios.get(`https://extra-life.org/api/participants/${id}`).then(res => res.data)
}

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

export const percentage = (donations: number, goal: number) => Math.floor((donations / goal) * 100)
