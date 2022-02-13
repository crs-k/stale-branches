jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('assert')
jest.mock('../../src/functions/get-context')

const core = require('@actions/core')
const assert = require('assert')
import {updateIssue} from '../../src/functions/update-issue'
import {github} from '../../src/functions/get-context'
import  * as context  from '../../src/functions/get-context'

let issueNumber = 20
let branchName = 'test'
let commitAge = 100

describe('Get Commits Function', () => {

  test('updateIssue endpoint is called', async () => {
    Object.defineProperty(context,'commentUpdates',{value: true})
    await updateIssue(issueNumber, branchName, commitAge)
    expect(github.rest.issues.createComment).toHaveBeenCalled()
  })

  test('Action fails elegantly', async () => {
    core.info = jest.fn()
    assert.ok = jest.fn()
    assert.ok.mockImplementation(() => {
      throw new Error('Created At cannot be empty')
    })

    await updateIssue(issueNumber, branchName, commitAge)
    expect(core.info).toHaveBeenCalledWith(
      `No existing issue returned for issue number: 20. Error: Created At cannot be empty`
    )
  })
})
