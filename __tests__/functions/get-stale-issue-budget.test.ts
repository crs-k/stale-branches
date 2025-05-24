jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('assert')
jest.mock('../../src/functions/get-context')

const core = require('@actions/core')
const assert = require('assert')
import {getIssueBudget} from '../../src/functions/get-stale-issue-budget'
import {github} from '../../src/functions/get-context'

let maxIssues = 5
let staleBranchLabel = 'Stale Branch Label'

describe('Get Stale Issue Budget Function', () => {
  test('getIssueBudget - 5 max issues', async () => {
    core.info = jest.fn()
    assert.ok = jest.fn()
    await getIssueBudget(maxIssues, staleBranchLabel)

    expect(github.paginate).toHaveBeenCalled()
    expect(assert.ok).toHaveBeenCalled()
    expect(core.info).toHaveBeenCalled()
  })

  test('getIssueBudget - <1 max issues', async () => {
    let maxIssues = 0
    core.info = jest.fn()
    assert.ok = jest.fn()
    await getIssueBudget(maxIssues, staleBranchLabel)

    expect(github.paginate).toHaveBeenCalled()
    expect(assert.ok).toHaveBeenCalled()
    expect(core.info).toHaveBeenCalled()
  })

  test('Action fails elegantly - Error', async () => {
    core.setFailed = jest.fn()
    assert.ok = jest.fn()
    assert.ok.mockImplementation(() => {
      throw new Error('Issue ID cannot be empty')
    })

    await getIssueBudget(maxIssues, staleBranchLabel)
    expect(core.setFailed).toHaveBeenCalledWith(`Failed to calculate issue budget. Error: Issue ID cannot be empty`)
  })

  test('Action fails elegantly - String', async () => {
    core.setFailed = jest.fn()
    assert.ok = jest.fn()
    assert.ok.mockImplementation(() => {
      throw new String('Issue ID cannot be empty')
    })

    await getIssueBudget(maxIssues, staleBranchLabel)
    expect(core.setFailed).toHaveBeenCalledWith(`Failed to calculate issue budget.`)
  })
  
  test('Correctly calculates remaining budget with existing issues', async () => {
    // Setup
    core.info = jest.fn()
    assert.ok = jest.fn()
    
    // Mock 3 issues with the stale branch label
    const mockIssues = [
      { issueTitle: 'Stale Branch 1', issueNumber: 101 },
      { issueTitle: 'Stale Branch 2', issueNumber: 102 },
      { issueTitle: 'Stale Branch 3', issueNumber: 103 }
    ]
    
    // Setup the mock to return our test data
    jest.spyOn(github, 'paginate').mockResolvedValueOnce(mockIssues)
    
    // Execute with max issues of 5
    const result = await getIssueBudget(5, staleBranchLabel)
    
    // Verify - should be 5 max - 3 existing = 2 remaining
    expect(result).toBe(2)
    expect(core.info).toHaveBeenCalledWith(expect.stringContaining('2'))
  })
  
  test('Returns 0 when existing issues exceed max', async () => {
    // Setup
    core.info = jest.fn()
    assert.ok = jest.fn()
    
    // Mock 5 issues with the stale branch label
    const mockIssues = [
      { issueTitle: 'Stale Branch 1', issueNumber: 101 },
      { issueTitle: 'Stale Branch 2', issueNumber: 102 },
      { issueTitle: 'Stale Branch 3', issueNumber: 103 },
      { issueTitle: 'Stale Branch 4', issueNumber: 104 },
      { issueTitle: 'Stale Branch 5', issueNumber: 105 }
    ]
    
    // Setup the mock to return our test data
    jest.spyOn(github, 'paginate').mockResolvedValueOnce(mockIssues)
    
    // Execute with max issues of 3 (less than existing)
    const result = await getIssueBudget(3, staleBranchLabel)
    
    // Verify - should return 0 since max limit is exceeded
    expect(result).toBe(0)
  })
  
  test('Validates that issues are not empty', async () => {
    core.info = jest.fn()
    core.setFailed = jest.fn()
    
    // Setup mock to return empty array
    jest.spyOn(github, 'paginate').mockResolvedValueOnce([])
    
    // Mock assertion to throw
    assert.ok = jest.fn().mockImplementationOnce(() => {
      throw new Error('Issue ID cannot be empty')
    })
    
    await getIssueBudget(maxIssues, staleBranchLabel)
    
    expect(assert.ok).toHaveBeenCalledWith([], 'Issue ID cannot be empty')
    expect(core.setFailed).toHaveBeenCalledWith('Failed to calculate issue budget. Error: Issue ID cannot be empty')
  })
})
