jest.mock('@actions/core')
jest.mock('@actions/github')

const core = require('@actions/core')
import {deleteBranch} from '../../src/functions/delete-branch'
import {github} from '../../src/functions/get-context'

jest.mock('../../src/functions/get-context')
let branchName = 'test'

describe('Delete Branch Function', () => {
  beforeEach(() => {})
  test('deleteBranch endpoint is called', async () => {
    await deleteBranch(branchName)

    expect(github.rest.git.deleteRef).toHaveBeenCalled()
  })

  test('Action fails elegantly', async () => {
    core.error = jest.fn()

    await deleteBranch(branchName)
    expect(core.error).toHaveBeenCalledWith(
      `Failed to delete branch heads/test:  Cannot read properties of undefined (reading 'status')`
    )
  })
})
