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
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Set up default paginate mock for all tests
    ;(github.paginate as any) = jest.fn().mockImplementation(async (endpoint: any, options: any, mapper?: any) => {
      // Mock the raw response that would come from the API
      const mockResponse = {
        data: [
          {title: 'Issue 1', number: 1},
          {title: 'Issue 2', number: 2}
        ]
      }
      // Call the mapper function to achieve coverage
      return mapper ? mapper(mockResponse) : []
    })
  })
  
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
})
