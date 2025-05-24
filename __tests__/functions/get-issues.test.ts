import * as core from '@actions/core'
import {getIssues} from '../../src/functions/get-issues'
import {github} from '../../src/functions/get-context'

jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('../../src/functions/get-context')

const staleBranchLabel = 'Stale Branch Label'

describe('Get Issues Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('github.paginate endpoint is called', async () => {
    const mockInfo = jest.fn()
    ;(core.info as jest.Mock) = mockInfo

    // Mock successful response to avoid throwing error
    jest.spyOn(github, 'paginate').mockResolvedValueOnce([{issueTitle: 'Test Issue', issueNumber: 1}])
    await getIssues(staleBranchLabel)

    expect(github.paginate).toHaveBeenCalled()
  })

  test('Action fails elegantly - Error', async () => {
    const mockSetFailed = jest.fn()
    ;(core.setFailed as jest.Mock) = mockSetFailed

    // Mock paginate to return undefined to trigger error
    jest.spyOn(github, 'paginate').mockResolvedValueOnce(undefined)

    await getIssues(staleBranchLabel)
    expect(core.setFailed).toHaveBeenCalledWith('Failed to locate issues. Error: Issue ID cannot be empty')
  })

  test('Action fails elegantly - String', async () => {
    const mockSetFailed = jest.fn()
    ;(core.setFailed as jest.Mock) = mockSetFailed

    // Mock paginate to throw a string error
    jest.spyOn(github, 'paginate').mockRejectedValueOnce('Issue ID cannot be empty')

    await getIssues(staleBranchLabel)
    expect(core.setFailed).toHaveBeenCalledWith('Failed to locate issues.')
  })

  test('Returns issues with expected content', async () => {
    // Mock data to return from paginate
    const mockIssues = [
      {title: 'Issue 1', number: 101},
      {title: 'Issue 2', number: 102}
    ]

    jest.spyOn(github, 'paginate').mockResolvedValueOnce(
      mockIssues.map(issue => ({
        issueTitle: issue.title,
        issueNumber: issue.number
      }))
    )

    const result = await getIssues(staleBranchLabel)

    expect(result).toHaveLength(2)
    expect(result[0].issueTitle).toBe('Issue 1')
    expect(result[0].issueNumber).toBe(101)
    expect(result[1].issueTitle).toBe('Issue 2')
    expect(result[1].issueNumber).toBe(102)

    // Verify the parameters passed to paginate
    expect(github.paginate).toHaveBeenCalledWith(
      github.rest.issues.listForRepo,
      {
        owner: expect.any(String),
        repo: expect.any(String),
        state: 'open',
        labels: staleBranchLabel,
        per_page: 100
      },
      expect.any(Function)
    )
  })

  test('Validates that issues are not empty', async () => {
    const mockInfo = jest.fn()
    const mockSetFailed = jest.fn()
    ;(core.info as jest.Mock) = mockInfo
    ;(core.setFailed as jest.Mock) = mockSetFailed

    // Setup mock to return null/undefined which triggers the error (empty array doesn't trigger error)
    jest.spyOn(github, 'paginate').mockResolvedValueOnce(null)

    await getIssues(staleBranchLabel)

    // Verify that setFailed is called with the right error message
    expect(core.setFailed).toHaveBeenCalledWith('Failed to locate issues. Error: Issue ID cannot be empty')
  })
})
