jest.mock('@actions/core')
jest.mock('@actions/github')

const core = require('@actions/core')
import {getIssues} from '../../src/functions/get-issues'
import {github} from '../../src/functions/get-context'

jest.mock('../../src/functions/get-context')
let sha = '123'
describe('Get Commits Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('getIssues endpoint is called', async () => {
    await getIssues()

    expect(github.rest.issues.listForRepo).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      state: 'open',
      labels: 'stale branch 🗑️'
    })
  })

  test('Action fails elegantly', async () => {
    core.setFailed = jest.fn()

    await getIssues()

    expect(github.rest.issues.listForRepo).toHaveBeenCalled()
    expect(core.setFailed).toHaveBeenCalledWith(`Failed to locate issues.`)
  })
})
