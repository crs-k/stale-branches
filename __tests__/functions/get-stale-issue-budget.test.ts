jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('assert')
jest.mock('../../src/functions/get-context')

const core = require('@actions/core')
const assert = require('assert')
import {getIssueBudget} from '../../src/functions/get-stale-issue-budget'
import {github} from '../../src/functions/get-context'
import * as context from '../../src/functions/get-context'

describe('Get Stale Issue Budget Function', () => {
  test('getIssueBudget endpoint is called', async () => {
    Object.defineProperty(context, 'maxIssues', {value: 1})

    await getIssueBudget()

    expect(github.rest.issues.listForRepo).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      state: 'open',
      labels: 'stale branch 🗑️'
    })
  })

  test('Action fails elegantly', async () => {
    core.setFailed = jest.fn()
    assert.ok = jest.fn()
    assert.ok.mockImplementation(() => {
      throw new Error('Issue ID cannot be empty')
    })

    await getIssueBudget()
    expect(core.setFailed).toHaveBeenCalledWith(`Failed to calculate issue budget. Error: Issue ID cannot be empty`)
    expect(core.setFailed).toHaveBeenCalledWith(`Failed to calculate issue budget.`)
  })
})
