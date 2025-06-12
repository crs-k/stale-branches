import {logRateLimitBreak} from '../../../src/functions/logging/log-rate-limit-break'
import {RateLimit} from '../../../src/types/rate-limit'
import styles from 'ansi-styles'

describe('logRateLimitBreak', () => {
  it('returns formatted rate limit break message', () => {
    const rateLimit: RateLimit = {
      used: 95,
      reset: 15,
      remaining: 5,
      resetDateTime: new Date('2024-01-01T12:00:00Z')
    }
    const result = logRateLimitBreak(rateLimit)
    const expected = `Exiting due to rate limit usage of ${styles.redBright.open}${rateLimit.used}%${styles.redBright.close}. Rate limit resets in ${styles.magenta.open}${rateLimit.reset}${styles.magenta.close} minutes @ ${styles.magenta.open}${rateLimit.resetDateTime}${styles.magenta.close}.`
    
    expect(result).toBe(expected)
  })

  it('handles different usage percentages', () => {
    const rateLimit: RateLimit = {
      used: 100,
      reset: 30,
      remaining: 0,
      resetDateTime: new Date('2024-01-01T15:30:00Z')
    }
    const result = logRateLimitBreak(rateLimit)
    const expected = `Exiting due to rate limit usage of ${styles.redBright.open}${rateLimit.used}%${styles.redBright.close}. Rate limit resets in ${styles.magenta.open}${rateLimit.reset}${styles.magenta.close} minutes @ ${styles.magenta.open}${rateLimit.resetDateTime}${styles.magenta.close}.`
    
    expect(result).toBe(expected)
  })

  it('handles zero reset time', () => {
    const rateLimit: RateLimit = {
      used: 98,
      reset: 0,
      remaining: 2,
      resetDateTime: new Date('2024-01-01T12:00:00Z')
    }
    const result = logRateLimitBreak(rateLimit)
    const expected = `Exiting due to rate limit usage of ${styles.redBright.open}${rateLimit.used}%${styles.redBright.close}. Rate limit resets in ${styles.magenta.open}${rateLimit.reset}${styles.magenta.close} minutes @ ${styles.magenta.open}${rateLimit.resetDateTime}${styles.magenta.close}.`
    
    expect(result).toBe(expected)
  })
})