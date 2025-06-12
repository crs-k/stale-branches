jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('../../src/functions/get-context')

const core = require('@actions/core')
import {getPr} from '../../src/functions/get-pr'
import {github} from '../../src/functions/get-context'

let branchName = 'test-branch'

describe('Get PR Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('getPr returns count of incoming and outgoing PRs', async () => {
    // Mock incoming PRs
    const mockIncomingPrs = [{id: 1}, {id: 2}]
    // Mock outgoing PRs
    const mockOutgoingPrs = [{id: 3}]

    const pullsListSpy = jest.spyOn(github.rest.pulls, 'list')
      .mockResolvedValueOnce({data: mockIncomingPrs} as any)
      .mockResolvedValueOnce({data: mockOutgoingPrs} as any)

    const result = await getPr(branchName)

    expect(pullsListSpy).toHaveBeenCalledTimes(2)
    expect(pullsListSpy).toHaveBeenNthCalledWith(1, {
      owner: 'owner',
      repo: 'repo',
      base: branchName
    })
    expect(pullsListSpy).toHaveBeenNthCalledWith(2, {
      owner: 'owner',
      repo: 'repo',
      head: `owner:${branchName}`
    })
    expect(result).toBe(3)
  })

  test('getPr returns 0 when no PRs exist', async () => {
    const pullsListSpy = jest.spyOn(github.rest.pulls, 'list')
      .mockResolvedValueOnce({data: []} as any)
      .mockResolvedValueOnce({data: []} as any)

    const result = await getPr(branchName)

    expect(result).toBe(0)
  })

  test('Action fails elegantly - Error', async () => {
    core.setFailed = jest.fn()
    const pullsListSpy = jest.spyOn(github.rest.pulls, 'list').mockRejectedValueOnce(new Error('API Error'))

    const result = await getPr(branchName)

    expect(core.setFailed).toHaveBeenCalledWith(`Failed to retrieve pull requests for ${branchName}. Error: API Error`)
    expect(result).toBe(0)
  })

  test('Action fails elegantly - String', async () => {
    core.setFailed = jest.fn()
    const pullsListSpy = jest.spyOn(github.rest.pulls, 'list').mockRejectedValueOnce(new String('API Error'))

    const result = await getPr(branchName)

    expect(core.setFailed).toHaveBeenCalledWith(`Failed to retrieve pull requests for ${branchName}.`)
    expect(result).toBe(0)
  })
})