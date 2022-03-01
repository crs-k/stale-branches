import {RateLimit} from '../../types/rate-limit'
import styles from 'ansi-styles'

export function logRateLimit(rateLimit: RateLimit): string {
  const rateLimitColor = `Rate Limit Used: ${styles.greenBright.open}${rateLimit.used}%${styles.greenBright.close}, Rate Limit Remaining: ${styles.greenBright.open}${rateLimit.remaining}%${styles.greenBright.close}, Resets in ${styles.greenBright.open}${rateLimit.remaining}${styles.greenBright.close} minutes.`

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
