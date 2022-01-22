export function getDays(date1, date2): string {
  const diffMs = Math.abs(date2 - date1)
  const days = diffMs / (1000 * 60 * 60 * 24)
  return days.toString()
}

export function getHours(date1, date2): string {
  const diffMs = Math.abs(date2 - date1)
  const hours = diffMs / (1000 * 60 * 60)
  return hours.toString()
}

export function getMinutes(date1, date2): string {
  const diffMs = Math.abs(date2 - date1)
  const minutes = diffMs / (1000 * 60)
  return minutes.toString()
}

export function getnSeconds(date1, date2): string {
  const diffMs = Math.abs(date2 - date1)
  const seconds = diffMs / 1000
  return seconds.toString()
}
