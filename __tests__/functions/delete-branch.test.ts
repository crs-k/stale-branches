import * as core from '@actions/core'
import {deleteBranch} from '../../src/functions/delete-branch'
import {github} from '../../src/functions/get-context'

jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('../../src/functions/get-context')

const branchName = 'test'

describe('Delete Branch Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('deleteBranch endpoint is called', async () => {
    // Mock successful response
    jest.spyOn(github.rest.git, 'deleteRef').mockResolvedValueOnce({status: 204} as never)
    
    await deleteBranch(branchName)
    expect(github.rest.git.deleteRef).toHaveBeenCalled()
  })

  test('Action fails elegantly - Error', async () => {
    const mockError = jest.fn()
    ;(core.error as jest.Mock) = mockError

    // Mock API call to throw an error (simulates actual failure scenarios)
    jest.spyOn(github.rest.git, 'deleteRef').mockRejectedValueOnce(new Error('response cannot be empty'))

    await deleteBranch(branchName)
    expect(core.error).toHaveBeenCalledWith('Failed to delete branch heads/test. Error: response cannot be empty')
  })

  test('Action fails elegantly - String', async () => {
    const mockError = jest.fn()
    ;(core.error as jest.Mock) = mockError

    // Mock API call to throw a string error
    jest.spyOn(github.rest.git, 'deleteRef').mockRejectedValueOnce('response cannot be empty')

    await deleteBranch(branchName)
    expect(core.error).toHaveBeenCalledWith('Failed to delete branch heads/test.')
  })
})
