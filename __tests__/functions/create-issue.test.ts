jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('assert')
jest.mock('../../src/functions/get-context')

const core = require('@actions/core')
const assert = require('assert')
import {createIssue} from '../../src/functions/create-issue'
import {github} from '../../src/functions/get-context'
import * as context from '../../src/functions/get-context'

let branchName = 'test'
let commitAge = 1
let lastCommitter = 'crs-k'

describe('Create Issue Function', () => {
  test('createIssue endpoint is called with tag committer enabled', async () => {
    Object.defineProperty(context, 'tagLastCommitter', {value: true})
    await createIssue(branchName, commitAge, lastCommitter)
    expect(github.rest.issues.create).toHaveBeenCalled()
  })

  test('createIssue endpoint is called with tag committer disabled', async () => {
    Object.defineProperty(context, 'tagLastCommitter', {value: false})
    await createIssue(branchName, commitAge, lastCommitter)
    expect(github.rest.issues.create).toHaveBeenCalled()
  })

  test('Action fails elegantly', async () => {
    core.setFailed = jest.fn()
    assert.ok = jest.fn()
    assert.ok.mockImplementation(() => {
      throw new Error('Issue ID cannot be empty')
    })

    await createIssue(branchName, commitAge, lastCommitter)
    expect(core.setFailed).toHaveBeenCalledWith(`Failed to create issue for test. Error: Issue ID cannot be empty`)
  })
})
