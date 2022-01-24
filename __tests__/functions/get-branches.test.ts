jest.mock('@actions/core')
jest.mock('@actions/github')

const core = require('@actions/core')
import {getBranches} from '../../src/functions/get-branches'
import {github} from '../../src/functions/get-context'

jest.mock('../../src/functions/get-context')

describe('Get Branches Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
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

  test('Infos are set', async () => {
    core.info = jest.fn()
    await getBranches()

    expect(core.info).toHaveBeenNthCalledWith(1, 'Retrieving branch information...')
  })

  test('Action fails elegantly', async () => {
    core.setFailed = jest.fn()

    await getBranches()

    expect(github.rest.repos.listBranches).toHaveBeenCalled()
    expect(core.setFailed).toHaveBeenCalledWith('Failed to retrieve branches for repo.')
  })
})
