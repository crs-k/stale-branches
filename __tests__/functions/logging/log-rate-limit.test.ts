import {logRateLimit} from '../../../src/functions/logging/log-rate-limit'
import {RateLimit} from '../../../src/types/rate-limit'
import styles from 'ansi-styles'

describe('logRateLimit', () => {
  it('returns green message when rate limit used is below 80%', () => {
    const rateLimit: RateLimit = {
      used: 50,
      reset: 15,
      remaining: 50,
      resetDateTime: new Date('2024-01-01T12:00:00Z')
    }
    const result = logRateLimit(rateLimit)
    const expected = `Rate Limit Used: ${styles.greenBright.open}${rateLimit.used}%${styles.greenBright.close}. Resets in ${styles.magenta.open}${rateLimit.reset}${styles.magenta.close} minutes.`
    
    expect(result).toBe(expected)
  })

  it('returns yellow message when rate limit used is 80-90%', () => {
    const rateLimit: RateLimit = {
      used: 85,
      reset: 10,
      remaining: 15,
      resetDateTime: new Date('2024-01-01T12:00:00Z')
    }
    const result = logRateLimit(rateLimit)
    const expected = `Rate Limit Used: ${styles.yellowBright.open}${rateLimit.used}%${styles.yellowBright.close}. Resets in ${styles.magenta.open}${rateLimit.reset}${styles.magenta.close} minutes.`
    
    expect(result).toBe(expected)
  })

  it('returns red message when rate limit used is above 90%', () => {
    const rateLimit: RateLimit = {
      used: 95,
      reset: 5,
      remaining: 5,
      resetDateTime: new Date('2024-01-01T12:00:00Z')
    }
    const result = logRateLimit(rateLimit)
    const expected = `Rate Limit Used: ${styles.redBright.open}${rateLimit.used}%${styles.redBright.close}. Resets in ${styles.magenta.open}${rateLimit.reset}${styles.magenta.close} minutes.`
    
    expect(result).toBe(expected)
  })

  it('returns yellow message for exactly 80% usage', () => {
    const rateLimit: RateLimit = {
      used: 80,
      reset: 20,
      remaining: 20,
      resetDateTime: new Date('2024-01-01T12:00:00Z')
    }
    const result = logRateLimit(rateLimit)
    const expected = `Rate Limit Used: ${styles.yellowBright.open}${rateLimit.used}%${styles.yellowBright.close}. Resets in ${styles.magenta.open}${rateLimit.reset}${styles.magenta.close} minutes.`
    
    expect(result).toBe(expected)
  })

  it('returns red message for exactly 91% usage', () => {
    const rateLimit: RateLimit = {
      used: 91,
      reset: 8,
      remaining: 9,
      resetDateTime: new Date('2024-01-01T12:00:00Z')
    }
    const result = logRateLimit(rateLimit)
    const expected = `Rate Limit Used: ${styles.redBright.open}${rateLimit.used}%${styles.redBright.close}. Resets in ${styles.magenta.open}${rateLimit.reset}${styles.magenta.close} minutes.`
    
    expect(result).toBe(expected)
  })

  it('handles zero usage', () => {
    const rateLimit: RateLimit = {
      used: 0,
      reset: 60,
      remaining: 100,
      resetDateTime: new Date('2024-01-01T12:00:00Z')
    }
    const result = logRateLimit(rateLimit)
    const expected = `Rate Limit Used: ${styles.greenBright.open}${rateLimit.used}%${styles.greenBright.close}. Resets in ${styles.magenta.open}${rateLimit.reset}${styles.magenta.close} minutes.`
    
    expect(result).toBe(expected)
  })
})