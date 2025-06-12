jest.mock('@actions/core')
jest.mock('assert')
jest.mock('../../src/functions/get-context')
jest.mock('../../src/functions/utils/get-time')

const core = require('@actions/core')
const assert = require('assert')
import {getRateLimit} from '../../src/functions/get-rate-limit'
import {github} from '../../src/functions/get-context'
import {getMinutes} from '../../src/functions/utils/get-time'

describe('Get Rate Limit Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock getMinutes function
    ;(getMinutes as jest.Mock).mockReturnValue(30)
  })

  test('getRateLimit returns rate limit data successfully', async () => {
    const mockRateLimitData = {
      data: {
        resources: {
          core: {
            limit: 5000,
            used: 1000,
            remaining: 4000,
            reset: 1640995200 // Unix timestamp
          }
        }
      }
    }

    const rateLimitSpy = jest.spyOn(github.rest.rateLimit, 'get').mockResolvedValueOnce(mockRateLimitData as any)
    assert.ok = jest.fn()

    const result = await getRateLimit()

    expect(rateLimitSpy).toHaveBeenCalled()
    expect(assert.ok).toHaveBeenCalledWith(result, 'Rate Limit Response cannot be empty.')
    expect(result.used).toBe(20) // 1000/5000 * 100
    expect(result.remaining).toBe(80) // 4000/5000 * 100
    expect(result.reset).toBe(30) // mocked getMinutes return value
    expect(result.resetDateTime).toBeInstanceOf(Date)
  })

  test('Action fails elegantly - Error', async () => {
    core.info = jest.fn()
    const rateLimitSpy = jest.spyOn(github.rest.rateLimit, 'get').mockRejectedValueOnce(new Error('Rate limit API error'))

    const result = await getRateLimit()

    expect(core.info).toHaveBeenCalledWith('Failed to retrieve rate limit data. Error: Rate limit API error')
    expect(result).toEqual({})
  })

  test('Action fails elegantly - String', async () => {
    core.info = jest.fn()
    const rateLimitSpy = jest.spyOn(github.rest.rateLimit, 'get').mockRejectedValueOnce(new String('Rate limit API error'))

    const result = await getRateLimit()

    expect(core.info).toHaveBeenCalledWith('Failed to retrieve rate limit data.')
    expect(result).toEqual({})
  })

  test('Action fails elegantly - assert.ok throws Error', async () => {
    core.info = jest.fn()
    const mockRateLimitData = {
      data: {
        resources: {
          core: {
            limit: 5000,
            used: 1000,
            remaining: 4000,
            reset: 1640995200
          }
        }
      }
    }

    const rateLimitSpy = jest.spyOn(github.rest.rateLimit, 'get').mockResolvedValueOnce(mockRateLimitData as any)
    assert.ok = jest.fn().mockImplementation(() => {
      throw new Error('Rate Limit Response cannot be empty.')
    })

    const result = await getRateLimit()

    expect(core.info).toHaveBeenCalledWith('Failed to retrieve rate limit data. Error: Rate Limit Response cannot be empty.')
    // The function still returns the calculated data even when assert.ok throws
    expect(result.used).toBe(20)
    expect(result.remaining).toBe(80)
    expect(result.reset).toBe(30)
    expect(result.resetDateTime).toBeInstanceOf(Date)
  })
})