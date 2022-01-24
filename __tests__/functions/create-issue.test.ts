jest.mock('@actions/core')
jest.mock('@actions/github')

const core = require('@actions/core')
import {createIssue} from '../../src/functions/create-issue'
import {github} from '../../src/functions/get-context'

jest.mock('../../src/functions/get-context')
let branchName = 'test'
let commitAge = 1
describe('Create Issue Function', () => {
  beforeEach(() => {})
  test('createIssue endpoint is called', async () => {
    await createIssue(branchName, commitAge)

    expect(github.rest.issues.create).toHaveBeenCalled()
  })

  test('Action fails elegantly', async () => {
    core.setFailed = jest.fn()

    await createIssue(branchName, commitAge)
    expect(core.setFailed).toHaveBeenCalledWith(
      `Failed to create issue for test with Cannot read properties of undefined (reading 'data')`
    )
  })
})
