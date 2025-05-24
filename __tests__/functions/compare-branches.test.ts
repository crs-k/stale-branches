import * as core from '@actions/core'
import {compareBranches} from '../../src/functions/compare-branches'
import {github} from '../../src/functions/get-context'
import {getDefaultBranch} from '../../src/functions/get-default-branch'

jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('../../src/functions/get-context')
jest.mock('../../src/functions/get-default-branch')

const head = 'headBranch'

describe('Compare Branches Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock default branch call
    ;(getDefaultBranch as jest.Mock).mockResolvedValue('master')
  })

  test('compareCommitsWithBasehead endpoint is called with compare input off', async () => {
    const inputCompare = 'off'
    const data = await compareBranches(head, inputCompare)
    expect(github.rest.repos.compareCommitsWithBasehead).toHaveBeenCalledTimes(0)
    expect(data).toEqual({save: false})
  })

  test('compareCommitsWithBasehead endpoint is called with compare input info', async () => {
    const inputCompare = 'info'
    // Mock successful API response
    jest.spyOn(github.rest.repos, 'compareCommitsWithBasehead').mockResolvedValueOnce({
      data: {
        ahead_by: 1,
        behind_by: 2,
        status: 'diverged',
        total_commits: 3
      }
    } as never)

    const data = await compareBranches(head, inputCompare)
    expect(github.rest.repos.compareCommitsWithBasehead).toHaveBeenCalled()
    expect(data).toEqual({aheadBy: 1, behindBy: 2, branchStatus: 'diverged', save: false, totalCommits: 3})
  })

  test('compareCommitsWithBasehead endpoint is called with compare input save', async () => {
    const inputCompare = 'save'
    // Mock successful API response with 'ahead' status
    jest.spyOn(github.rest.repos, 'compareCommitsWithBasehead').mockResolvedValueOnce({
      data: {
        ahead_by: 1,
        behind_by: 2,
        status: 'diverged',
        total_commits: 3
      }
    } as never)

    const data = await compareBranches(head, inputCompare)
    expect(github.rest.repos.compareCommitsWithBasehead).toHaveBeenCalled()
    expect(data).toEqual({aheadBy: 1, behindBy: 2, branchStatus: 'diverged', save: true, totalCommits: 3})
  })

  test('Action fails elegantly - Error', async () => {
    const inputCompare = 'save'
    const mockInfo = jest.fn()
    ;(core.info as jest.Mock) = mockInfo

    // Mock API response with falsy status to trigger error
    jest.spyOn(github.rest.repos, 'compareCommitsWithBasehead').mockResolvedValueOnce({
      data: {
        ahead_by: 1,
        behind_by: 2,
        status: null,
        total_commits: 3
      }
    } as never)

    await compareBranches(head, inputCompare)
    expect(core.info).toHaveBeenCalledWith(
      'Failed to retrieve branch comparison data. Error: Branch Comparison Status cannot be empty.'
    )
  })

  test('Action fails elegantly - String', async () => {
    const inputCompare = 'save'
    const mockInfo = jest.fn()
    ;(core.info as jest.Mock) = mockInfo

    // Mock API call to throw a string error
    jest.spyOn(github.rest.repos, 'compareCommitsWithBasehead').mockRejectedValueOnce('Branch Comparison Status cannot be empty.')

    await compareBranches(head, inputCompare)
    expect(core.info).toHaveBeenCalledWith('Failed to retrieve branch comparison data.')
  })
})
