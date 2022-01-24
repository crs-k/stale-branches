jest.mock('@actions/core')
jest.mock('@actions/github')

const core = require('@actions/core')
import {closeIssue} from '../../src/functions/close-issue'
import {github} from '../../src/functions/get-context'

jest.mock('../../src/functions/get-context')
let issueNumber = 1
describe('Close Issue Function', () => {
  beforeEach(() => {})
  test('closeIssue endpoint is called', async () => {
    await closeIssue(issueNumber)

    expect(github.rest.issues.update).toHaveBeenCalled()
  })

  test('Infos are set', async () => {
    core.info = jest.fn()
    await closeIssue(issueNumber)

    expect(core.info).toHaveBeenCalled()
  })

  test('Action fails elegantly', async () => {
    core.info = jest.fn()

    await closeIssue(issueNumber)
    expect(core.info).toHaveBeenCalledWith(
      `No existing issue returned for issue number: 1. Description: Cannot read properties of undefined (reading 'data')`
    )
  })
})
