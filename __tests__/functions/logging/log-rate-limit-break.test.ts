import {logRateLimitBreak} from '../../../src/functions/logging/log-rate-limit-break'
import {RateLimit} from '../../../src/types/rate-limit'
import styles from 'ansi-styles'

// Mock ansi-styles
jest.mock('ansi-styles', () => ({
  redBright: {
    open: '[RED_BRIGHT]',
    close: '[/RED_BRIGHT]'
  },
  magenta: {
    open: '[MAGENTA]',
    close: '[/MAGENTA]'
  }
}))

describe('logRateLimitBreak', () => {
  it('formats rate limit break message with proper colors', () => {
    const rateLimit: RateLimit = {
      used: 95,
      reset: 30,
      resetDateTime: new Date('2023-01-01T15:30:00Z'),
      remaining: 5
    }
    
    const result = logRateLimitBreak(rateLimit)
    
    expect(result).toBe(
      `Exiting due to rate limit usage of ${styles.redBright.open}${rateLimit.used}%${styles.redBright.close}. ` +
      `Rate limit resets in ${styles.magenta.open}${rateLimit.reset}${styles.magenta.close} minutes @ ` +
      `${styles.magenta.open}${rateLimit.resetDateTime}${styles.magenta.close}.`
    )
  })

  it('handles edge case values', () => {
    const resetDate = new Date('2023-01-01T00:00:00Z');
    const rateLimit: RateLimit = {
      used: 100,
      reset: 0,
      resetDateTime: resetDate,
      remaining: 0
    }
    
    const result = logRateLimitBreak(rateLimit)
    
    expect(result).toBe(
      `Exiting due to rate limit usage of ${styles.redBright.open}${rateLimit.used}%${styles.redBright.close}. ` +
      `Rate limit resets in ${styles.magenta.open}${rateLimit.reset}${styles.magenta.close} minutes @ ` +
      `${styles.magenta.open}${resetDate}${styles.magenta.close}.`
    )
  })
})
