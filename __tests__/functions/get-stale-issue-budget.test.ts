jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('../../src/functions/get-context')

import * as core from '@actions/core'
import {getIssueBudget} from '../../src/functions/get-stale-issue-budget'
import {github} from '../../src/functions/get-context'

const maxIssues = 5
const staleBranchLabel = 'Stale Branch Label'

describe('Get Stale Issue Budget Function', () => {
  let mockSetFailed: jest.Mock
  let mockInfo: jest.Mock

  beforeEach(() => {
    jest.resetAllMocks()
    mockSetFailed = jest.fn()
    mockInfo = jest.fn()
    ;(core.setFailed as jest.Mock) = mockSetFailed
    ;(core.info as jest.Mock) = mockInfo
  })

  test('getIssueBudget - 5 max issues', async () => {
    const mockIssues = [
      {issueTitle: 'Stale Branch 1', issueNumber: 101},
      {issueTitle: 'Stale Branch 2', issueNumber: 102}
    ]

    jest.spyOn(github, 'paginate').mockResolvedValueOnce(mockIssues)

    const result = await getIssueBudget(maxIssues, staleBranchLabel)

    expect(github.paginate).toHaveBeenCalled()
    expect(mockInfo).toHaveBeenCalled()
    expect(result).toBe(3) // 5 max - 2 existing = 3 remaining
  })

  test('getIssueBudget - <1 max issues', async () => {
    const localMaxIssues = 0
    const mockIssues: {issueTitle: string; issueNumber: number}[] = []

    jest.spyOn(github, 'paginate').mockResolvedValueOnce(mockIssues)

    const result = await getIssueBudget(localMaxIssues, staleBranchLabel)

    expect(github.paginate).toHaveBeenCalled()
    expect(mockInfo).toHaveBeenCalled()
    expect(result).toBe(0)
  })

  test('Action fails elegantly - Error', async () => {
    jest.spyOn(github, 'paginate').mockRejectedValueOnce(new Error('Issue ID cannot be empty'))

    await getIssueBudget(maxIssues, staleBranchLabel)

    expect(mockSetFailed).toHaveBeenCalledWith('Failed to calculate issue budget. Error: Issue ID cannot be empty')
  })

  test('Action fails elegantly - String', async () => {
    jest.spyOn(github, 'paginate').mockRejectedValueOnce('Issue ID cannot be empty')

    await getIssueBudget(maxIssues, staleBranchLabel)

    expect(mockSetFailed).toHaveBeenCalledWith('Failed to calculate issue budget.')
  })

  test('Correctly calculates remaining budget with existing issues', async () => {
    // Mock 3 issues with the stale branch label
    const mockIssues = [
      {issueTitle: 'Stale Branch 1', issueNumber: 101},
      {issueTitle: 'Stale Branch 2', issueNumber: 102},
      {issueTitle: 'Stale Branch 3', issueNumber: 103}
    ]

    // Setup the mock to return our test data
    jest.spyOn(github, 'paginate').mockResolvedValueOnce(mockIssues)

    // Execute with max issues of 5
    const result = await getIssueBudget(5, staleBranchLabel)

    // Verify - should be 5 max - 3 existing = 2 remaining
    expect(result).toBe(2)
    expect(mockInfo).toHaveBeenCalledWith(expect.stringContaining('2'))
  })

  test('Returns 0 when existing issues exceed max', async () => {
    // Mock 5 issues with the stale branch label
    const mockIssues = [
      {issueTitle: 'Stale Branch 1', issueNumber: 101},
      {issueTitle: 'Stale Branch 2', issueNumber: 102},
      {issueTitle: 'Stale Branch 3', issueNumber: 103},
      {issueTitle: 'Stale Branch 4', issueNumber: 104},
      {issueTitle: 'Stale Branch 5', issueNumber: 105}
    ]

    // Setup the mock to return our test data
    jest.spyOn(github, 'paginate').mockResolvedValueOnce(mockIssues)

    // Execute with max issues of 3 (less than existing)
    const result = await getIssueBudget(3, staleBranchLabel)

    // Verify - should return 0 since max limit is exceeded
    expect(result).toBe(0)
  })
})
