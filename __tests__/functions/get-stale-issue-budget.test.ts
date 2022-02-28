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
})
