jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('assert')
jest.mock('../../src/functions/get-context')

const core = require('@actions/core')
const assert = require('assert')
import {getRecentCommitLogin} from '../../src/functions/get-committer-login'
import {github} from '../../src/functions/get-context'

let sha = '123'
describe('Get Commits Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('getRecentCommitDate endpoint is called', async () => {
    await getRecentCommitLogin(sha)

    expect(github.rest.repos.getCommit).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      ref: sha,
      per_page: 1,
      page: 1
    })
  })

  test('Action fails elegantly - Error', async () => {
    core.info = jest.fn()
    assert.ok = jest.fn()
    assert.ok.mockImplementation(() => {
      throw new Error('Login cannot be empty.')
    })

    await getRecentCommitLogin(sha)
    expect(core.info).toHaveBeenCalledWith(`Failed to retrieve commit for 123 in repo. Error: Login cannot be empty.`)
  })

  test('Action fails elegantly - String', async () => {
    core.info = jest.fn()
    assert.ok = jest.fn()
    assert.ok.mockImplementation(() => {
      throw new String('Login cannot be empty.')
    })

    await getRecentCommitLogin(sha)
    expect(core.info).toHaveBeenCalledWith(`Failed to retrieve commit for 123 in repo.`)
  })

  test('Handles missing owner or repo gracefully', async () => {
    github.rest.repos.getCommit = jest.fn().mockRejectedValue(new Error('Not Found')) as unknown as typeof github.rest.repos.getCommit;

    core.info = jest.fn()

    await getRecentCommitLogin(sha)

    expect(core.info).toHaveBeenCalledWith(
      `Failed to retrieve commit for 123 in repo. Error: Not Found`
    )
  })


})
