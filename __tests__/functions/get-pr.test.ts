import * as core from '@actions/core'
import {getPr} from '../../src/functions/get-pr'

// Mock dependencies
jest.mock('@actions/core')
jest.mock('../../src/functions/get-context', () => ({
  github: {
    rest: {
      pulls: {
        list: jest.fn()
      }
    }
  },
  owner: 'test-owner',
  repo: 'test-repo'
}))

const mockCore = core as jest.Mocked<typeof core>

describe('Get PR Function', () => {
  const mockGitHub = require('../../src/functions/get-context').github

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return total count of incoming and outgoing PRs', async () => {
    mockGitHub.rest.pulls.list
      .mockResolvedValueOnce({ data: [{id: 1}, {id: 2}] } as any)
      .mockResolvedValueOnce({ data: [{id: 3}] } as any)

    const result = await getPr('test-branch')

    expect(result).toBe(3)
    expect(mockGitHub.rest.pulls.list).toHaveBeenCalledTimes(2)
    expect(mockGitHub.rest.pulls.list).toHaveBeenCalledWith({
      owner: 'test-owner',
      repo: 'test-repo',
      base: 'test-branch'
    })
    expect(mockGitHub.rest.pulls.list).toHaveBeenCalledWith({
      owner: 'test-owner',
      repo: 'test-repo',
      head: 'test-owner:test-branch'
    })
  })

  test('should handle Error instance and return 0', async () => {
    const error = new Error('API Error')
    mockGitHub.rest.pulls.list.mockRejectedValue(error)

    const result = await getPr('test-branch')

    expect(result).toBe(0)
    expect(mockCore.setFailed).toHaveBeenCalledWith('Failed to retrieve pull requests for test-branch. Error: API Error')
  })

  test('should handle non-Error exception and return 0', async () => {
    mockGitHub.rest.pulls.list.mockRejectedValue('String error')

    const result = await getPr('test-branch')

    expect(result).toBe(0)
    expect(mockCore.setFailed).toHaveBeenCalledWith('Failed to retrieve pull requests for test-branch.')
  })
})
