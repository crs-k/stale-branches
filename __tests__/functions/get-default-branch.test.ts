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
    assert.ok.mockImplementation(() => {
      throw new Error('Failed to get default branch')
    })

    await getDefaultBranch()
    expect(core.setFailed).toHaveBeenCalledWith(`Failed to get default branch: Failed to get default branch`)
  })
})
