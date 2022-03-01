import {RateLimit} from '../../types/rate-limit'
import styles from 'ansi-styles'

export function logRateLimit(rateLimit: RateLimit): string {
  let rateLimitColor = `Rate Limit Used: ${styles.greenBright.open}${rateLimit.used}%${styles.greenBright.close}. Resets in ${styles.magenta.open}${rateLimit.remaining}${styles.magenta.close} minutes.`

  // color output based on remaining rate limit %
  if (rateLimit.used > 95) {
    rateLimitColor = `Rate Limit Used: ${styles.redBright.open}${rateLimit.used}%${styles.redBright.close}. Resets in ${styles.magenta.open}${rateLimit.remaining}${styles.magenta.close} minutes.`
  } else if (rateLimit.used >= 85) {
    rateLimitColor = `Rate Limit Used: ${styles.yellowBright.open}${rateLimit.used}%${styles.yellowBright.close}. Resets in ${styles.magenta.open}${rateLimit.remaining}${styles.magenta.close} minutes.`
  } else if (rateLimit.used < 85) {
    rateLimitColor = `Rate Limit Used: ${styles.greenBright.open}${rateLimit.used}%${styles.greenBright.close}. Resets in ${styles.magenta.open}${rateLimit.remaining}${styles.magenta.close} minutes.`
  }

  return rateLimitColor
}
