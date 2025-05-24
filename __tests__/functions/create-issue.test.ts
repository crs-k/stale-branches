import * as core from '@actions/core'
import {createIssue} from '../../src/functions/create-issue'
import {github} from '../../src/functions/get-context'

jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('../../src/functions/get-context')

const branchName = 'test'
const commitAge = 1
const lastCommitter = 'crs-k'
const daysBeforeDelete = 180
const staleBranchLabel = 'Stale Branch Label'
const tagLastCommitter = true

describe('Create Issue Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('createIssue endpoint is called with tag committer enabled', async () => {
    // Mock successful response to prevent errors
    jest.spyOn(github.rest.issues, 'create').mockResolvedValueOnce({data: {id: 123}} as never)

    await createIssue(branchName, commitAge, lastCommitter, daysBeforeDelete, staleBranchLabel, tagLastCommitter)
    expect(github.rest.issues.create).toHaveBeenCalled()
  })

  test('createIssue endpoint is called with tag committer disabled', async () => {
    const tagLastCommitterDisabled = false
    // Mock successful response to prevent errors
    jest.spyOn(github.rest.issues, 'create').mockResolvedValueOnce({data: {id: 123}} as never)

    await createIssue(
      branchName,
      commitAge,
      lastCommitter,
      daysBeforeDelete,
      staleBranchLabel,
      tagLastCommitterDisabled
    )
    expect(github.rest.issues.create).toHaveBeenCalled()
  })

  test('Action fails elegantly - Error', async () => {
    const mockSetFailed = jest.fn()
    ;(core.setFailed as jest.Mock) = mockSetFailed

    // Mock the github API call to return response with falsy id (triggers error condition)
    jest.spyOn(github.rest.issues, 'create').mockResolvedValueOnce({data: {id: null}} as never)

    await createIssue(branchName, commitAge, lastCommitter, daysBeforeDelete, staleBranchLabel, tagLastCommitter)
    expect(core.setFailed).toHaveBeenCalledWith('Failed to create issue for test. Error: Issue ID cannot be empty')
  })

  test('Action fails elegantly - String', async () => {
    const mockSetFailed = jest.fn()
    ;(core.setFailed as jest.Mock) = mockSetFailed

    // Mock the github API call to throw a string error
    jest.spyOn(github.rest.issues, 'create').mockRejectedValueOnce('Issue ID cannot be empty')

    await createIssue(branchName, commitAge, lastCommitter, daysBeforeDelete, staleBranchLabel, tagLastCommitter)
    expect(core.setFailed).toHaveBeenCalledWith('Failed to create issue for test.')
  })
})
