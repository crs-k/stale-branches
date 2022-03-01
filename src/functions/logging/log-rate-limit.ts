import {RateLimit} from '../../types/rate-limit'
import styles from 'ansi-styles'

export function logRateLimit(rateLimit: RateLimit): string {
  let rateLimitColor = `Rate Limit Used: ${styles.greenBright.open}${rateLimit.used}%${styles.greenBright.close}. Resets in ${styles.magenta.open}${rateLimit.reset}${styles.magenta.close} minutes @ ${styles.magenta.open}${rateLimit.resetDateTime}${styles.magenta.close}.`

  // color output based on remaining rate limit %
  if (rateLimit.used > 90) {
    rateLimitColor = `Rate Limit Used: ${styles.redBright.open}${rateLimit.used}%${styles.redBright.close}. Resets in ${styles.magenta.open}${rateLimit.reset}${styles.magenta.close} minutes @ ${styles.magenta.open}${rateLimit.resetDateTime}${styles.magenta.close}.`
  } else if (rateLimit.used >= 80) {
    rateLimitColor = `Rate Limit Used: ${styles.yellowBright.open}${rateLimit.used}%${styles.yellowBright.close}. Resets in ${styles.magenta.open}${rateLimit.reset}${styles.magenta.close} minutes @ ${styles.magenta.open}${rateLimit.resetDateTime}${styles.magenta.close}.`
  } else if (rateLimit.used < 80) {
    rateLimitColor = `Rate Limit Used: ${styles.greenBright.open}${rateLimit.used}%${styles.greenBright.close}. Resets in ${styles.magenta.open}${rateLimit.reset}${styles.magenta.close} minutes @ ${styles.magenta.open}${rateLimit.resetDateTime}${styles.magenta.close}.`
  }

  return rateLimitColor
}
