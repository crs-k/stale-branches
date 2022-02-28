jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('assert')
jest.mock('../../src/functions/get-context')

const core = require('@actions/core')
const assert = require('assert')
import {closeIssue} from '../../src/functions/close-issue'
import {github} from '../../src/functions/get-context'
import {logCloseIssue} from '../../src/functions/logging/log-close-issue'

let issueNumber = 1
let state = 'closed'

describe('Close Issue Function', () => {
  test('closeIssue endpoint is called', async () => {
    await closeIssue(issueNumber)
    expect(github.rest.issues.update).toHaveBeenCalledWith({
      issue_number: 1,
      owner: 'owner',
      repo: 'repo',
      state: 'closed'
    })
    expect(github.rest.issues.update).toHaveReturnedWith({
      data: {issue_number: 1, owner: 'owner', repo: 'repo', state: 'closed'}
    })
  })

  test('Infos are set', async () => {
    core.info = jest.fn()
    await closeIssue(issueNumber)
    expect(core.info).toHaveBeenCalledWith(logCloseIssue(issueNumber, state))
  })

  test('Action fails elegantly - Error', async () => {
    core.info = jest.fn()
    assert.ok = jest.fn()
    assert.ok.mockImplementation(() => {
      throw new Error('State cannot be empty')
    })

    await closeIssue(issueNumber)
    expect(core.info).toHaveBeenCalledWith(`No existing issue returned for issue number: 1. Description: State cannot be empty`)
  })

  test('Action fails elegantly - String', async () => {
    core.info = jest.fn()
    assert.ok = jest.fn()
    assert.ok.mockImplementation(() => {
      throw new String('State cannot be empty')
    })

    await closeIssue(issueNumber)
    expect(core.info).toHaveBeenCalledWith(`No existing issue returned for issue number: 1.`)
  })
})
