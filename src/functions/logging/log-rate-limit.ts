import {RateLimit} from '../../types/rate-limit'
import styles from 'ansi-styles'

export function logRateLimit(rateLimit: RateLimit): string {
  const rateLimitUsed = rateLimit.used / rateLimit.limit
  const rateLimitRemaining = rateLimit.remaining / rateLimit.limit
  const d = new Date(0) // The 0 there is the key, which sets the date to the epoch
  const rateLimitReset = d.setUTCSeconds(rateLimit.reset)

  const rateLimitColor = `Rate Limit Used: ${styles.greenBright.open}${rateLimitUsed}${styles.greenBright.close}, Rate Limit Remaining: ${styles.greenBright.open}${rateLimitRemaining}${styles.greenBright.close}, Rate Limit Reset: ${styles.greenBright.open}${rateLimitReset}${styles.greenBright.close}`

  //color group based on age of branch
  /*   if (commitAge > daysBeforeDelete) {
    rateLimitColor = `[${styles.redBright.open}${rateLimit}${styles.redBright.close}]`
  } else if (commitAge > daysBeforeStale) {
    rateLimitColor = `[${styles.yellowBright.open}${rateLimit}${styles.yellowBright.close}]`
  } else if (commitAge < daysBeforeStale) {
    rateLimitColor = `[${styles.greenBright.open}${rateLimit}${styles.greenBright.close}]`
  } */

  return rateLimitColor
}
