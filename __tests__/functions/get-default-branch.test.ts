jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('../../src/functions/get-context')

import * as core from '@actions/core'
import {getDefaultBranch} from '../../src/functions/get-default-branch'
import {github} from '../../src/functions/get-context'

describe('Get Default Branch Function', () => {
  let mockSetFailed: jest.Mock

  beforeEach(() => {
    jest.resetAllMocks()
    mockSetFailed = jest.fn()
    ;(core.setFailed as jest.Mock) = mockSetFailed
  })

  test('github.rest.repos.get endpoint is called', async () => {
    // Mock successful response
    jest.spyOn(github.rest.repos, 'get').mockResolvedValueOnce({
      data: {
        default_branch: 'main'
      }
    } as any)

    const result = await getDefaultBranch()

    expect(github.rest.repos.get).toHaveBeenCalled()
    expect(result).toBe('main')
  })

  test('Action fails elegantly - Error', async () => {
    // Mock an error that's not a 404 wiki case
    const mockError = new Error('Generic error')
    jest.spyOn(github.rest.repos, 'get').mockRejectedValueOnce(mockError)

    // Execute
    const result = await getDefaultBranch()

    // Verify
    expect(result).toBe('')
    expect(mockSetFailed).toHaveBeenCalledWith('Failed to get default branch: Generic error')
  })

  test('Action fails elegantly - Non-Error exception', async () => {
    // Mock a non-Error exception
    jest.spyOn(github.rest.repos, 'get').mockImplementationOnce(() => {
      throw 'String exception'
    })

    // Execute
    const result = await getDefaultBranch()

    // Verify
    expect(result).toBe('')
    // The current implementation doesn't call setFailed with the message for non-Error exceptions
    expect(mockSetFailed).not.toHaveBeenCalled()
  })

  test('Handles wiki repository special case', async () => {
    // Setup
    const mockError = new Error('Not found')
    Object.defineProperty(mockError, 'status', {value: 404})

    // Mock repo name to be a wiki
    jest.spyOn(github.rest.repos, 'get').mockImplementationOnce(() => {
      throw mockError
    })

    // Mock the repo value from get-context
    const getContext = require('../../src/functions/get-context')
    const originalRepo = getContext.repo
    getContext.repo = 'test-repo.wiki'

    // Execute
    const result = await getDefaultBranch()

    // Verify
    expect(result).toBe('main')
    expect(mockSetFailed).not.toHaveBeenCalled()

    // Restore
    getContext.repo = originalRepo
  })
})
