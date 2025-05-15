jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('assert')
jest.mock('../../src/functions/get-context')

const core = require('@actions/core')
const assert = require('assert')
import {getRecentCommitAge, getRecentCommitAgeByNonIgnoredMessage} from '../../src/functions/get-commit-age'
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

describe('getRecentCommitAgeByNonIgnoredMessage', () => {
  let listCommitsMock: jest.Mock
  beforeAll(() => {
    listCommitsMock = jest.fn()
    Object.defineProperty(github.rest.repos, 'listCommits', {
      value: listCommitsMock,
      writable: true,
      configurable: true
    })
  })
  beforeEach(() => {
    jest.clearAllMocks()
    listCommitsMock.mockReset()
  })

  test('returns age of most recent commit not matching ignored messages', async () => {
    const now = new Date('2024-01-10T00:00:00Z').getTime()
    jest.spyOn(Date, 'now').mockReturnValue(now)
    listCommitsMock.mockResolvedValue({
      data: [
        {
          commit: {message: 'Automated commit', committer: {date: '2024-01-01T00:00:00Z'}}
        },
        {
          commit: {message: 'Human commit', committer: {date: '2023-12-31T00:00:00Z'}}
        }
      ]
    })
    const age = await getRecentCommitAgeByNonIgnoredMessage('sha', ['Automated commit'], 20)
    expect(age).toBe(10)
  })

  test('returns maxAgeDays if all non-ignored commits are older than maxAgeDays', async () => {
    const now = new Date('2024-01-10T00:00:00Z').getTime()
    jest.spyOn(Date, 'now').mockReturnValue(now)
    listCommitsMock.mockResolvedValue({
      data: [
        {
          commit: {message: 'Ignored', committer: {date: '2024-01-09T00:00:00Z'}}
        },
        {
          commit: {message: 'Human commit', committer: {date: '2023-01-01T00:00:00Z'}}
        }
      ]
    })
    const age = await getRecentCommitAgeByNonIgnoredMessage('sha', ['Ignored'], 20)
    expect(age).toBe(20)
  })

  test('returns correct age if non-ignored commit is within maxAgeDays', async () => {
    const now = new Date('2024-01-10T00:00:00Z').getTime()
    jest.spyOn(Date, 'now').mockReturnValue(now)
    listCommitsMock.mockResolvedValue({
      data: [
        {
          commit: {message: 'Ignored', committer: {date: '2024-01-09T00:00:00Z'}}
        },
        {
          commit: {message: 'Human commit', committer: {date: '2024-01-05T00:00:00Z'}}
        }
      ]
    })
    const age = await getRecentCommitAgeByNonIgnoredMessage('sha', ['Ignored'], 10)
    expect(age).toBe(5)
  })

  test('throws error if no commits are found at all', async () => {
    listCommitsMock.mockResolvedValueOnce({data: []})
    await expect(getRecentCommitAgeByNonIgnoredMessage('sha', ['Ignored'], 10)).rejects.toThrow('No non-ignored commit found')
  })

  test('throws error if all commits are ignored and none are older than maxAgeDays', async () => {
    const now = new Date('2024-01-10T00:00:00Z').getTime()
    jest.spyOn(Date, 'now').mockReturnValue(now)
    listCommitsMock
      .mockResolvedValueOnce({
        data: [
          {
            commit: {message: 'Ignored', committer: {date: '2024-01-09T00:00:00Z'}}
          },
          {
            commit: {message: 'Ignored', committer: {date: '2024-01-08T00:00:00Z'}}
          }
        ]
      })
      .mockResolvedValueOnce({data: []}) // End the loop
    await expect(getRecentCommitAgeByNonIgnoredMessage('sha', ['Ignored'], 10)).rejects.toThrow('No non-ignored commit found')
  })

  test('returns age when ignored message is a substring', async () => {
    const now = new Date('2024-01-10T00:00:00Z').getTime()
    jest.spyOn(Date, 'now').mockReturnValue(now)
    listCommitsMock.mockResolvedValue({
      data: [
        {
          commit: {message: 'Automated commit', committer: {date: '2024-01-01T00:00:00Z'}}
        },
        {
          commit: {message: 'Human commit', committer: {date: '2023-12-31T00:00:00Z'}}
        }
      ]
    })
    const age = await getRecentCommitAgeByNonIgnoredMessage('sha', ['Automated'], 20)
    expect(age).toBe(10)
  })

  test('returns age when some commits have no message', async () => {
    const now = new Date('2024-01-10T00:00:00Z').getTime()
    jest.spyOn(Date, 'now').mockReturnValue(now)
    listCommitsMock.mockResolvedValue({
      data: [
        {
          commit: {}
        },
        {
          commit: {message: 'Human commit', committer: {date: '2023-12-31T00:00:00Z'}}
        }
      ]
    })
    const age = await getRecentCommitAgeByNonIgnoredMessage('sha', ['Automated'], 20)
    expect(age).toBe(10)
  })
})
