import * as core from '@actions/core'
import * as assert from 'assert'
import {getRateLimit} from '../../src/functions/get-rate-limit'
import * as timeUtils from '../../src/functions/utils/get-time'

// Mock dependencies
jest.mock('@actions/core')
jest.mock('assert')
jest.mock('../../src/functions/get-context', () => ({
  github: {
    rest: {
      rateLimit: {
        get: jest.fn()
      }
    }
  },
  owner: 'test-owner',
  repo: 'test-repo'
}))
jest.mock('../../src/functions/utils/get-time')

const mockCore = core as jest.Mocked<typeof core>
const mockAssert = assert as jest.Mocked<typeof assert>
const mockTimeUtils = timeUtils as jest.Mocked<typeof timeUtils>

describe('Get Rate Limit Function', () => {
  const mockGitHub = require('../../src/functions/get-context').github

  beforeEach(() => {
    jest.clearAllMocks()
    mockTimeUtils.getMinutes = jest.fn().mockReturnValue(30)
  })

  test('should return rate limit data successfully', async () => {
    const mockResponse = {
      data: {
        resources: {
          core: {
            used: 2000,
            limit: 5000,
            remaining: 3000,
            reset: Math.floor(Date.now() / 1000) + 1800
          }
        }
      }
    }
    mockGitHub.rest.rateLimit.get.mockResolvedValue(mockResponse as any)

    const result = await getRateLimit()

    expect(result.used).toBe(40) // 2000/5000 * 100
    expect(result.remaining).toBe(60) // 3000/5000 * 100
    expect(result.reset).toBe(30)
    expect(mockAssert.ok).toHaveBeenCalledWith(result, 'Rate Limit Response cannot be empty.')
  })

  test('should handle Error instance and log message', async () => {
    const error = new Error('Rate limit API error')
    mockGitHub.rest.rateLimit.get.mockRejectedValue(error)

    const result = await getRateLimit()

    expect(mockCore.info).toHaveBeenCalledWith('Failed to retrieve rate limit data. Error: Rate limit API error')
    expect(result).toEqual({})
  })

  test('should handle non-Error exception and log generic message', async () => {
    mockGitHub.rest.rateLimit.get.mockRejectedValue('String error')

    const result = await getRateLimit()

    expect(mockCore.info).toHaveBeenCalledWith('Failed to retrieve rate limit data.')
    expect(result).toEqual({})
  })
})
