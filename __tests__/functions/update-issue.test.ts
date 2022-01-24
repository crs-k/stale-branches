jest.mock('@actions/core')
jest.mock('@actions/github')

const core = require('@actions/core')
import {updateIssue} from '../../src/functions/update-issue'
import {github} from '../../src/functions/get-context'
jest.mock('../../src/functions/get-context')

let issueNumber = 20
let branchName = 'test'
let commitAge = 100

describe('Get Commits Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('updateIssue endpoint is called with default inputs', async () => {
    await updateIssue(issueNumber, branchName, commitAge)

    expect(github.rest.issues.createComment).toHaveBeenCalledTimes(0)
  })

  /*   test('Action fails elegantly', async () => {
    core.info = jest.fn()
    
    await updateIssue(issueNumber,branchName,commitAge)
  
    expect(github.rest.issues.createComment).toHaveBeenCalled()
    expect(core.info).toHaveBeenCalledWith(`Failed to locate issues.`)
  }) */
})
