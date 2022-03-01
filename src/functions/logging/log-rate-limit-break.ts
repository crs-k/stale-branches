import {RateLimit} from '../../types/rate-limit'
import styles from 'ansi-styles'

export function logRateLimitBreak(rateLimit: RateLimit): string {
  const rateLimitBreak = `Exiting due to rate limit usage of ${styles.redBright.open}${rateLimit.used}%${styles.redBright.close}. Rate limit resets in ${styles.magenta.open}${rateLimit.reset}${styles.magenta.close} minutes @ ${styles.magenta.open}${rateLimit.resetDateTime}${styles.magenta.close}.`

  return rateLimitBreak
}
