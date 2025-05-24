jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('assert')
jest.mock('../../src/functions/get-context')

const core = require('@actions/core')
const assert = require('assert')
import {getIssues} from '../../src/functions/get-issues'
import {github} from '../../src/functions/get-context'

let staleBranchLabel = 'Stale Branch Label'

describe('Get Issues Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('github.paginate endpoint is called', async () => {
    core.info = jest.fn()
    assert.ok = jest.fn()
    await getIssues(staleBranchLabel)

    expect(github.paginate).toHaveBeenCalled()
    expect(assert.ok).toHaveBeenCalled()
  })

  test('Action fails elegantly - Error', async () => {
    core.setFailed = jest.fn()
    assert.ok = jest.fn()
    assert.ok.mockImplementation(() => {
      throw new Error('Issue ID cannot be empty')
    })

    await getIssues(staleBranchLabel)
    expect(core.setFailed).toHaveBeenCalledWith(`Failed to locate issues. Error: Issue ID cannot be empty`)
  })

  test('Action fails elegantly - String', async () => {
    core.setFailed = jest.fn()
    assert.ok = jest.fn()
    assert.ok.mockImplementation(() => {
      throw new String('Issue ID cannot be empty')
    })

    await getIssues(staleBranchLabel)
    expect(core.setFailed).toHaveBeenCalledWith(`Failed to locate issues.`)
  })

  test('Returns issues with expected content', async () => {
    // Mock data to return from paginate
    const mockIssues = [
      { title: 'Issue 1', number: 101 },
      { title: 'Issue 2', number: 102 }
    ]
    
    // Clear all mocks first
    jest.clearAllMocks()
    
    // Setup the mock to return our test data - need to reset mock implementation
    assert.ok = jest.fn() // Prevent assertion failure
    jest.spyOn(github, 'paginate').mockResolvedValueOnce(mockIssues.map(issue => ({
      issueTitle: issue.title,
      issueNumber: issue.number
    })))
    
    // Execute
    const result = await getIssues(staleBranchLabel)
    
    // Verify
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
    core.info = jest.fn()
    core.setFailed = jest.fn()
    
    // Setup mock to return empty array
    jest.spyOn(github, 'paginate').mockResolvedValueOnce([])
    
    assert.ok = jest.fn().mockImplementationOnce(() => {
      throw new Error('Issue ID cannot be empty')
    })
    
    await getIssues(staleBranchLabel)
    
    // Verify that setFailed is called with the right error message
    expect(core.setFailed).toHaveBeenCalledWith('Failed to locate issues. Error: Issue ID cannot be empty')
    
    expect(assert.ok).toHaveBeenCalledWith([], 'Issue ID cannot be empty')
    expect(core.setFailed).toHaveBeenCalledWith('Failed to locate issues. Error: Issue ID cannot be empty')
  })
})
