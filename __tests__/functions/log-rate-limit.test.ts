import {logRateLimit} from '../../src/functions/logging/log-rate-limit'
import {RateLimit} from '../../src/types/rate-limit'

describe('Log Rate Limit Function', () => {
  test('should return green formatting for low usage', () => {
    const rateLimit: RateLimit = {
      used: 50,
      remaining: 4500,
      reset: 30,
      resetDateTime: new Date()
    }
    const result = logRateLimit(rateLimit)
    expect(result).toContain('50%')
    expect(result).toContain('30')
    expect(result).toContain('Rate Limit Used')
  })

  test('should return yellow formatting for medium usage', () => {
    const rateLimit: RateLimit = {
      used: 85,
      remaining: 750,
      reset: 15,
      resetDateTime: new Date()
    }
    const result = logRateLimit(rateLimit)
    expect(result).toContain('85%')
    expect(result).toContain('15')
  })

  test('should return red formatting for high usage', () => {
    const rateLimit: RateLimit = {
      used: 95,
      remaining: 250,
      reset: 10,
      resetDateTime: new Date()
    }
    const result = logRateLimit(rateLimit)
    expect(result).toContain('95%')
    expect(result).toContain('10')
  })
})
