import {getRecentCommitInfo} from '../../src/functions/get-commit-info'

const mockCommits = [
  {
    commit: {message: 'WIP: temp', committer: {date: '2023-01-01T00:00:00Z'}, author: {name: 'Alice'}},
    committer: {login: 'alice'},
    author: {login: 'alice'}
  },
  {
    commit: {message: 'fix: bug', committer: {date: '2023-01-02T00:00:00Z'}, author: {name: 'Bob'}},
    committer: {login: 'bob'},
    author: {login: 'bob'}
  },
  {
    commit: {message: 'feat: add feature', committer: {date: '2023-01-03T00:00:00Z'}, author: {name: 'Carol'}},
    committer: {login: 'carol'},
    author: {login: 'carol'}
  }
]

const mockDefaultBranchShas = new Set(['sha1', 'sha2'])

describe('getRecentCommitInfo', () => {
  let githubBackup: any
  beforeAll(() => {
    githubBackup = require('../../src/functions/get-context').github
  })
  afterAll(() => {
    require('../../src/functions/get-context').github = githubBackup
  })
  beforeEach(() => {
    require('../../src/functions/get-context').github = {
      rest: {
        repos: {
          listCommits: jest.fn().mockResolvedValueOnce({data: mockCommits}).mockResolvedValue({data: []})
        }
      }
    }
  })

  it('ignores commits by message', async () => {
    const result = await getRecentCommitInfo('sha', ['WIP'], undefined, [])
    expect(result.committer).toBe('bob')
    expect(result.ignoredCount).toBe(1)
  })

  it('ignores commits by committer', async () => {
    const result = await getRecentCommitInfo('sha', [], undefined, ['alice'])
    expect(result.committer).toBe('bob')
    expect(result.ignoredCount).toBe(1)
  })

  it('ignores commits by both message and committer', async () => {
    const result = await getRecentCommitInfo('sha', ['fix'], undefined, ['alice'])
    expect(result.committer).toBe('carol')
    expect(result.ignoredCount).toBe(2)
  })

  it('returns first commit if no ignores match', async () => {
    const result = await getRecentCommitInfo('sha', [], undefined, [])
    expect(result.committer).toBe('alice')
    expect(result.ignoredCount).toBe(0)
  })

  it('ignores commits present in default branch when ignoreDefaultBranchCommits is true', async () => {
    // Mark the first commit as present in default branch
    const commits = [
      {...mockCommits[0], sha: 'sha1'},
      {...mockCommits[1], sha: 'sha3'},
      {...mockCommits[2], sha: 'sha4'}
    ]
    require('../../src/functions/get-context').github = {
      rest: {
        repos: {
          listCommits: jest.fn().mockResolvedValueOnce({data: commits}).mockResolvedValue({data: []})
        }
      }
    }
    const result = await getRecentCommitInfo('sha', [], undefined, [], mockDefaultBranchShas, true)
    expect(result.committer).toBe('bob')
    expect(result.ignoredCount).toBe(1)
  })

  it('ignores by message, committer, and default branch together', async () => {
    // First commit: ignored by default branch, second: ignored by committer, third: ignored by message
    const commits = [
      {...mockCommits[0], sha: 'sha1'}, // in default branch
      {...mockCommits[1], sha: 'sha3'}, // committer bob
      {...mockCommits[2], sha: 'sha4'} // message: feat: add feature
    ]
    require('../../src/functions/get-context').github = {
      rest: {
        repos: {
          listCommits: jest.fn().mockResolvedValueOnce({data: commits}).mockResolvedValue({data: []})
        }
      }
    }
    await expect(getRecentCommitInfo('sha', ['feat'], undefined, ['bob'], mockDefaultBranchShas, true)).rejects.toThrow('No non-ignored commit found')
  })

  it('ignores commits present in default branch within the staleness window', async () => {
    // Simulate a staleness window of 30 days
    const now = new Date()
    const withinWindow = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
    const outsideWindow = new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000).toISOString() // 40 days ago
    // Order: newest to oldest
    const commits = [
      {...mockCommits[1], sha: 'sha2', commit: {...mockCommits[1].commit, committer: {...mockCommits[1].commit.committer, date: withinWindow}}}, // not in default branch
      {...mockCommits[0], sha: 'sha1', commit: {...mockCommits[0].commit, committer: {...mockCommits[0].commit.committer, date: withinWindow}}}, // in default branch
      {...mockCommits[2], sha: 'sha3', commit: {...mockCommits[2].commit, committer: {...mockCommits[2].commit.committer, date: withinWindow}}} // in default branch
    ]
    // sha1 and sha3 are in default branch, sha2 is not
    const defaultBranchShas = new Set(['sha1', 'sha3'])
    require('../../src/functions/get-context').github = {
      rest: {
        repos: {
          listCommits: jest.fn().mockResolvedValueOnce({data: commits}).mockResolvedValue({data: []})
        }
      }
    }
    // Only sha2 should be considered meaningful (not in default branch within window)
    const info = await getRecentCommitInfo('sha1', [], 30, [], defaultBranchShas, true)
    expect(info.sha).toBe('sha2')
    expect(info.ignoredCount).toBe(0)
    expect(info.usedFallback).toBe(false)
  })

  it('does not ignore commits in default branch if outside staleness window', async () => {
    // Simulate a staleness window of 20 days
    const now = new Date()
    const outsideWindow = new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000).toISOString() // 40 days ago
    // Order: newest to oldest
    const commits = [
      {...mockCommits[0], sha: 'sha1', commit: {...mockCommits[0].commit, committer: {...mockCommits[0].commit.committer, date: outsideWindow}}}, // in default branch
      {...mockCommits[1], sha: 'sha2', commit: {...mockCommits[1].commit, committer: {...mockCommits[1].commit.committer, date: outsideWindow}}} // in default branch
    ]
    // Both SHAs are in default branch, but outside window
    const defaultBranchShas = new Set(['sha1', 'sha2'])
    require('../../src/functions/get-context').github = {
      rest: {
        repos: {
          listCommits: jest.fn().mockResolvedValueOnce({data: commits}).mockResolvedValue({data: []})
        }
      }
    }
    // Should NOT ignore, so first commit is returned
    const info = await getRecentCommitInfo('sha1', [], 20, [], defaultBranchShas, true)
    expect(info.usedFallback).toBe(true)
  })

  it('returns fallback if all commits are ignored by default branch presence', async () => {
    // All commits are in default branch and within window
    const now = new Date()
    const withinWindow = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
    // Order: newest to oldest
    const commits = [
      {...mockCommits[0], sha: 'sha1', commit: {...mockCommits[0].commit, committer: {...mockCommits[0].commit.committer, date: withinWindow}}},
      {...mockCommits[1], sha: 'sha2', commit: {...mockCommits[1].commit, committer: {...mockCommits[1].commit.committer, date: withinWindow}}}
    ]
    const defaultBranchShas = new Set(['sha1', 'sha2'])
    require('../../src/functions/get-context').github = {
      rest: {
        repos: {
          listCommits: jest.fn().mockResolvedValueOnce({data: commits}).mockResolvedValue({data: []})
        }
      }
    }
    // Should throw because all are ignored
    await expect(getRecentCommitInfo('sha1', [], 10, [], defaultBranchShas, true)).rejects.toThrow('No non-ignored commit found')
  })

  it('defaults ignoreDefaultBranchCommits to true if ignoreCommitMessages is set and ignoreDefaultBranchCommits is undefined', async () => {
    // Simulate a commit in default branch and a message to ignore
    const now = new Date()
    const withinWindow = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    // Order: newest to oldest
    const commits = [
      {...mockCommits[1], sha: 'sha2', commit: {...mockCommits[1].commit, committer: {...mockCommits[1].commit.committer, date: withinWindow, message: 'feat: add feature'}}},
      {...mockCommits[0], sha: 'sha1', commit: {...mockCommits[0].commit, committer: {...mockCommits[0].commit.committer, date: withinWindow, message: 'bot: update'}}}
    ]
    const defaultBranchShas = new Set(['sha1'])
    require('../../src/functions/get-context').github = {
      rest: {
        repos: {
          listCommits: jest.fn().mockResolvedValueOnce({data: commits}).mockResolvedValue({data: []})
        }
      }
    }
    // ignoreCommitMessages is set, ignoreDefaultBranchCommits is undefined (should default to true)
    const info = await getRecentCommitInfo('sha1', ['bot: update'], 5, [], defaultBranchShas, undefined)
    // sha1 is ignored by message and by default branch, so sha2 should be returned
    expect(info.sha).toBe('sha2')
    expect(info.ignoredCount).toBe(0)
    expect(info.usedFallback).toBe(false)
  })
})
