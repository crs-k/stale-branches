jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('assert')
jest.mock('../../src/functions/get-context')

const core = require('@actions/core')
const assert = require('assert')
import {getDefaultBranch} from '../../src/functions/get-default-branch'
import {github} from '../../src/functions/get-context'
import {Http2ServerResponse} from 'http2'

describe('Get Default Branch Function', () => {
  test('github.rest.repos.get endpoint is called', async () => {
    core.info = jest.fn()
    assert.ok = jest.fn()
    await getDefaultBranch()

    expect(github.rest.repos.get).toHaveBeenCalled()
    expect(assert.ok).toHaveBeenCalled()
  })

  test('Action fails elegantly - Error', async () => {
    core.setFailed = jest.fn()
    assert.ok = jest.fn()
    
    // Mock an error that's not a 404 wiki case
    const mockError = new Error('Generic error')
    jest.spyOn(github.rest.repos, 'get').mockRejectedValueOnce(mockError)
    
    // Execute
    const result = await getDefaultBranch()
    
    // Verify
    expect(result).toBe('')
    expect(core.setFailed).toHaveBeenCalledWith('Failed to get default branch: Generic error')
  })

  test('Action fails elegantly - Non-Error exception', async () => {
    core.setFailed = jest.fn()
    assert.ok = jest.fn()
    
    // Mock a non-Error exception
    jest.spyOn(github.rest.repos, 'get').mockImplementationOnce(() => {
      throw 'String exception'
    })
    
    // Execute
    const result = await getDefaultBranch()
    
    // Verify
    expect(result).toBe('')
    // The current implementation doesn't call setFailed with the message for non-Error exceptions
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  test('Handles wiki repository special case', async () => {
    // Setup
    core.setFailed = jest.fn()
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
    expect(core.setFailed).not.toHaveBeenCalled()
    
    // Restore
    getContext.repo = originalRepo
  })
})
