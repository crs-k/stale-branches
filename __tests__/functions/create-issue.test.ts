jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('assert')
jest.mock('../../src/functions/get-context')

const core = require('@actions/core')
const assert = require('assert')
import {createIssue} from '../../src/functions/create-issue'
import {github} from '../../src/functions/get-context'

let branchName = 'test'
let commitAge = 1
let lastCommitter = 'crs-k'
let daysBeforeDelete = 180
let staleBranchLabel = 'Stale Branch Label'
let tagLastCommitter = true

describe('Create Issue Function', () => {
  test('createIssue endpoint is called with tag committer enabled', async () => {
    await createIssue(branchName, commitAge, lastCommitter, daysBeforeDelete, staleBranchLabel, tagLastCommitter)
    expect(github.rest.issues.create).toHaveBeenCalled()
  })

  test('createIssue endpoint is called with tag committer disabled', async () => {
    let tagLastCommitter = false
    await createIssue(branchName, commitAge, lastCommitter, daysBeforeDelete, staleBranchLabel, tagLastCommitter)
    expect(github.rest.issues.create).toHaveBeenCalled()
  })

  test('Action fails elegantly', async () => {
    core.setFailed = jest.fn()
    assert.ok = jest.fn()
    assert.ok.mockImplementation(() => {
      throw new Error('Issue ID cannot be empty')
    })

    await createIssue(branchName, commitAge, lastCommitter, daysBeforeDelete, staleBranchLabel, tagLastCommitter)
    expect(core.setFailed).toHaveBeenCalledWith(`Failed to create issue for test. Error: Issue ID cannot be empty`)
  })
})
