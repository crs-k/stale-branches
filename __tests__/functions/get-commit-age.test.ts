jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('assert')
jest.mock('../../src/functions/get-context')

const core = require('@actions/core')
const assert = require('assert')
import {getRecentCommitAge} from '../../src/functions/get-commit-age'
import {github} from '../../src/functions/get-context'

let sha = '123'
describe('Get Commits Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('getRecentCommitDate endpoint is called', async () => {
    await getRecentCommitAge(sha)

    expect(github.rest.repos.getCommit).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      ref: sha,
      per_page: 1,
      page: 1
    })
  })

  test('Action fails elegantly - Error', async () => {
    core.setFailed = jest.fn()
    assert.ok = jest.fn()
    assert.ok.mockImplementation(() => {
      throw new Error('Date cannot be empty.')
    })

    await getRecentCommitAge(sha)
    expect(core.setFailed).toHaveBeenCalledWith(`Failed to retrieve commit for 123 in repo. Error: Date cannot be empty.`)
  })

  test('Action fails elegantly - String', async () => {
    core.setFailed = jest.fn()
    assert.ok = jest.fn()
    assert.ok.mockImplementation(() => {
      throw new String('Date cannot be empty.')
    })

    await getRecentCommitAge(sha)
    expect(core.setFailed).toHaveBeenCalledWith(`Failed to retrieve commit for 123 in repo.`)
  })
})
