jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('assert')
jest.mock('../../src/functions/get-context')

const core = require('@actions/core')
const assert = require('assert')
import {getIssues} from '../../src/functions/get-issues'
import {github} from '../../src/functions/get-context'

describe('Get Issues Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('getIssues endpoint is called', async () => {
    await getIssues()

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

    await getIssues()
    expect(core.setFailed).toHaveBeenCalledWith(`Failed to locate issues. Error: Issue ID cannot be empty`)
    expect(core.setFailed).toHaveBeenCalledWith(`Failed to locate issues.`)
  })
})
