jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('assert')
jest.mock('../../src/functions/get-context')

const core = require('@actions/core')
const assert = require('assert')
import {createIssueComment} from '../../src/functions/create-issue-comment'
import {github} from '../../src/functions/get-context'

let issueNumber = 20
let branchName = 'test'
let commitAge = 100
let lastCommitter = 'crs-k'
let commentUpdates = true
let daysBeforeDelete = 180
let staleBranchLabel = 'Stale Branch Label'
let tagLastCommitter = true

describe('Update Issue Function', () => {
  test('updateIssue endpoint is called with tag committer enabled', async () => {
    await createIssueComment(issueNumber, branchName, commitAge, lastCommitter, commentUpdates, daysBeforeDelete, staleBranchLabel, tagLastCommitter)
    expect(github.rest.issues.createComment).toHaveBeenCalled()
  })

  test('updateIssue endpoint is called with tag committer disabled', async () => {
    let tagLastCommitter = false
    await createIssueComment(issueNumber, branchName, commitAge, lastCommitter, commentUpdates, daysBeforeDelete, staleBranchLabel, tagLastCommitter)
    expect(github.rest.issues.createComment).toHaveBeenCalled()
  })

  test('Action fails elegantly', async () => {
    core.info = jest.fn()
    assert.ok = jest.fn()
    assert.ok.mockImplementation(() => {
      throw new Error('Created At cannot be empty')
    })

    await createIssueComment(issueNumber, branchName, commitAge, lastCommitter, commentUpdates, daysBeforeDelete, staleBranchLabel, tagLastCommitter)
    expect(core.info).toHaveBeenCalledWith(`No existing issue returned for issue number: 20. Error: Created At cannot be empty`)
  })
})
