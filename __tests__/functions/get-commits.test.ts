jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('assert')
jest.mock('../../src/functions/get-context')

const core = require('@actions/core')
const assert = require('assert')
import {getRecentCommitDate} from '../../src/functions/get-commits'
import {github} from '../../src/functions/get-context'

let sha = '123'
describe('Get Commits Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('getRecentCommitDate endpoint is called', async () => {
    await getRecentCommitDate(sha)

    expect(github.rest.repos.getCommit).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      ref: sha,
      per_page: 1,
      page: 1
    })
  })

  test('Action fails elegantly', async () => {
    core.setFailed = jest.fn()
    assert.ok = jest.fn()
    assert.ok.mockImplementation(() => {
      throw new Error('Date cannot be empty.')
    })

    await getRecentCommitDate(sha)
    expect(core.setFailed).toHaveBeenCalledWith(
      `Failed to retrieve commit for repo. Error: Date cannot be empty.`
    )
  })
})
