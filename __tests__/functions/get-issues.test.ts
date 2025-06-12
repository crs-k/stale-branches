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
    
    // Set up default paginate mock to actually call the mapper function
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
})
