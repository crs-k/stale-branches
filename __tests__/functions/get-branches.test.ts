jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('assert')
jest.mock('../../src/functions/get-context')

const core = require('@actions/core')
const assert = require('assert')
import {getBranches} from '../../src/functions/get-branches'
import {github} from '../../src/functions/get-context'

describe('Get Branches Function', () => {
  test('getBranches endpoint is called', async () => {
    await getBranches()

    expect(github.rest.repos.listBranches).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      protected: false,
      per_page: 100,
      page: 1
    })
  })

  test('Action fails elegantly', async () => {
    core.setFailed = jest.fn()
    assert.ok = jest.fn()
    assert.ok.mockImplementation(() => {
      throw new Error('Response cannot be empty.')
    })

    await getBranches()
    expect(core.setFailed).toHaveBeenCalledWith(
      `Failed to retrieve branches for repo. Error: Response cannot be empty.`
    )
    expect(core.setFailed).toHaveBeenCalledWith(`Failed to retrieve branches for repo.`)
  })
})
