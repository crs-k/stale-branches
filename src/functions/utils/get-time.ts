/**
 * Calcualtes the number of days between two dates
 *
 * @param {number} date1 Time value in milliseconds.
 *
 * @param {number} date2 Time value in milliseconds.
 *
 * @return {number} The number of days between two dates
 */
export function getDays(date1: number, date2: number): number {
  const diffMs = Math.abs(date2 - date1)
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24))
  return days
}

/**
 * Calcualtes the number of minutes between two dates
 *
 * @param {number} date1 Time value in milliseconds.
 *
 * @param {number} date2 Time value in milliseconds.
 *
 * @return {number} The number of minutes between two dates
 */
export function getMinutes(date1: number, date2: number): number {
  const diffMs = Math.abs(date2 - date1)
  const minutes = Math.round(diffMs / (1000 * 60))
  return minutes
}
/* USED FOR TESTING
export function getHours(date1, date2): number {
  const diffMs = Math.abs(date2 - date1)
  const hours = Math.round(diffMs / (1000 * 60 * 60))
  return hours
}



export function getnSeconds(date1, date2): number {
  const diffMs = Math.abs(date2 - date1)
  const seconds = Math.round(diffMs / 1000)
  return seconds
}
 */
