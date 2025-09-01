import { config } from '@/data/config'

export const timeslotFromIndex = (index: number) => {
  let hour = 0
  let streamHour = config.streamStart.split(':')[0]

  if (index + Number(streamHour) > 24) {
    hour = index + Number(streamHour) - 24
  } else hour = index + Number(streamHour)

  // Return the hour formatted to 12 hour time, including AM or PM in the string
  return hour > 12 ? `${hour - 12} PM` : `${hour} AM`
}

// Given a start time in the format hh:mm, return the index of the timeslot based on the
// streamStart time and a 30 minute interval with 48 possible slot indexes
// ex: 22:00 -> 1
// ex: 22:30 -> 2
// ex: 02:00 -> 13
export const timeslotIndexFromStart = (start: string) => {
  let index = 1
  let [hour, minute] = config.streamStart.split(':')
  let [startHour, startMinute] = start.split(':')

  // If the start hour and minutes are the same, return the index, otherwise dig deeper
  if (hour !== startHour || minute !== startMinute) {
    // If the start hour is greater than the hour, calculate the index
    if (Number(startHour) > Number(hour)) {
      index += (Number(startHour) - Number(hour)) * 2
    }

    // If the start hour is less than the hour, calculate the index
    else if (Number(startHour) < Number(hour)) {
      index += (Number(startHour) + 24 - Number(hour)) * 2
    }
  }

  // If the startMinute is greater than 30 add 1
  if (Number(startMinute) >= 30) {
    index += 1
  }

  return index
}
