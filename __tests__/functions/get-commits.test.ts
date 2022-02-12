jest.mock('@actions/core')
jest.mock('@actions/github')

const core = require('@actions/core')
import {getRecentCommitDate} from '../../src/functions/get-commits'
import {github} from '../../src/functions/get-context'

jest.mock('../../src/functions/get-context')
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

    await getRecentCommitDate(sha)

    expect(github.rest.repos.getCommit).toHaveBeenCalled()
    expect(core.setFailed).toHaveBeenCalledWith(
      `Failed to retrieve commit for repo. Error: Cannot read properties of undefined (reading 'data')`
    )
  })
})
