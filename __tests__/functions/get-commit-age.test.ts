jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('../../src/functions/get-context')

import * as core from '@actions/core'
import {getRecentCommitAge} from '../../src/functions/get-commit-age'
import {github} from '../../src/functions/get-context'

const sha = '123'
describe('Get Commits Function', () => {
  let mockSetFailed: jest.Mock

  beforeEach(() => {
    jest.resetAllMocks()
    mockSetFailed = jest.fn()
    ;(core.setFailed as jest.Mock) = mockSetFailed
  })

  test('getRecentCommitDate endpoint is called', async () => {
    // Mock successful response
    jest.spyOn(github.rest.repos, 'getCommit').mockResolvedValueOnce({
      data: {
        commit: {
          committer: {
            date: '2023-01-01T00:00:00Z'
          }
        }
      }
    } as any)

    await getRecentCommitAge(sha)

    expect(github.rest.repos.getCommit).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      ref: sha,
      per_page: 1,
      page: 1
    })
  })

  test('Action fails elegantly - Error', async () => {
    // Mock response with no committer date to trigger the error condition
    jest.spyOn(github.rest.repos, 'getCommit').mockResolvedValueOnce({
      data: {
        commit: {
          committer: null
        }
      }
    } as any)

    await getRecentCommitAge(sha)
    expect(mockSetFailed).toHaveBeenCalledWith('Failed to retrieve commit for 123 in repo. Error: Date cannot be empty.')
  })

  test('Action fails elegantly - String', async () => {
    // Mock GitHub API to reject with a string
    jest.spyOn(github.rest.repos, 'getCommit').mockRejectedValueOnce('Date cannot be empty.')

    await getRecentCommitAge(sha)
    expect(mockSetFailed).toHaveBeenCalledWith('Failed to retrieve commit for 123 in repo.')
  })
})
