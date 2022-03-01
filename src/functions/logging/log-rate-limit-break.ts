import {RateLimit} from '../../types/rate-limit'
import styles from 'ansi-styles'

export function logRateLimitBreak(rateLimit: RateLimit): string {
  const rateLimitBreak = `Exiting due to rate limit usage of ${styles.redBright.open}${rateLimit.used}%${styles.redBright.close}, Resets in ${styles.magenta.open}${rateLimit.remaining}${styles.magenta.close} minutes.`

  return rateLimitBreak
}
