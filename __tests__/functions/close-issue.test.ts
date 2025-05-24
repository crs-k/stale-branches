jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('../../src/functions/get-context')

import * as core from '@actions/core'
import {closeIssue} from '../../src/functions/close-issue'
import {github} from '../../src/functions/get-context'
import {logCloseIssue} from '../../src/functions/logging/log-close-issue'

const issueNumber = 1
const state = 'closed'

describe('Close Issue Function', () => {
  let mockInfo: jest.Mock

  beforeEach(() => {
    jest.resetAllMocks()
    mockInfo = jest.fn()
    ;(core.info as jest.Mock) = mockInfo
    
    // Default successful mock
    jest.spyOn(github.rest.issues, 'update').mockResolvedValue({
      data: {
        issue_number: issueNumber,
        owner: 'owner',
        repo: 'repo',
        state: 'closed'
      }
    } as any)
  })

  test('closeIssue endpoint is called', async () => {
    await closeIssue(issueNumber)
    expect(github.rest.issues.update).toHaveBeenCalledWith({
      issue_number: 1,
      owner: 'owner',
      repo: 'repo',
      state: 'closed'
    })
  })

  test('Infos are set', async () => {
    await closeIssue(issueNumber)
    expect(mockInfo).toHaveBeenCalledWith(logCloseIssue(issueNumber, state))
  })

  test('Action fails elegantly - Error', async () => {
    // Mock response with empty state to trigger the error condition
    jest.spyOn(github.rest.issues, 'update').mockResolvedValueOnce({
      data: {
        issue_number: issueNumber,
        owner: 'owner',
        repo: 'repo',
        state: ''
      }
    } as any)

    await closeIssue(issueNumber)
    expect(mockInfo).toHaveBeenCalledWith('No existing issue returned for issue number: 1. Description: State cannot be empty')
  })

  test('Action fails elegantly - String', async () => {
    // Mock GitHub API to reject with a string
    jest.spyOn(github.rest.issues, 'update').mockRejectedValueOnce('State cannot be empty')

    await closeIssue(issueNumber)
    expect(mockInfo).toHaveBeenCalledWith('No existing issue returned for issue number: 1.')
  })
})
