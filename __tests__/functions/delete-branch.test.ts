jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('assert')

const core = require('@actions/core')
const assert = require('assert')
import {deleteBranch} from '../../src/functions/delete-branch'
import {github} from '../../src/functions/get-context'

jest.mock('../../src/functions/get-context')
let branchName = 'test'

describe('Delete Branch Function', () => {
  test('deleteBranch endpoint is called', async () => {
    await deleteBranch(branchName)
    expect(github.rest.git.deleteRef).toHaveBeenCalled()
  })

  test('Action fails elegantly', async () => {
    core.error = jest.fn()
    assert.ok = jest.fn()
    assert.ok.mockImplementation(() => {
      throw new Error('response cannot be empty')
    })

    await deleteBranch(branchName)
    expect(core.error).toHaveBeenCalledWith(`Failed to delete branch heads/test. Error: response cannot be empty`)
  })
})
