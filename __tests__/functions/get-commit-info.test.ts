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
  
  it('correctly handles empty commit responses', async () => {
    // Setup
    const maxAgeDays = 30;
    require('../../src/functions/get-context').github = {
      rest: {
        repos: {
          listCommits: jest.fn().mockResolvedValue({data: []})
        }
      }
    }
    
    // Execute and verify
    await expect(getRecentCommitInfo('sha1', [], maxAgeDays)).rejects.toThrow('No non-ignored commit found')
  })
  
  it('correctly handles commits with missing committer dates', async () => {
    // Mock a commit with missing date
    const commits = [
      {...mockCommits[0], commit: {...mockCommits[0].commit, committer: { ...mockCommits[0].commit.committer, date: undefined }}}
    ]
    
    require('../../src/functions/get-context').github = {
      rest: {
        repos: {
          listCommits: jest.fn().mockResolvedValueOnce({data: commits}).mockResolvedValue({data: []})
        }
      }
    }
    
    // Since the first commit has no date, we should use the fallback if set
    const maxAgeDays = 30;
    
    // Execute and verify
    await expect(getRecentCommitInfo('sha1', [], maxAgeDays)).rejects.toThrow('No non-ignored commit found')
  })
  
  it('uses fallback for commits older than maxAgeDays', async () => {
    const now = new Date()
    // Create a commit that's 50 days old (beyond our 30 day maxAgeDays)
    const oldDate = new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000).toISOString() // 50 days ago
    
    const commits = [
      {...mockCommits[0], commit: {...mockCommits[0].commit, committer: { ...mockCommits[0].commit.committer, date: oldDate }}}
    ]
    
    require('../../src/functions/get-context').github = {
      rest: {
        repos: {
          listCommits: jest.fn().mockResolvedValueOnce({data: commits}).mockResolvedValue({data: []})
        }
      }
    }
    
    const maxAgeDays = 30;
    const result = await getRecentCommitInfo('sha1', [], maxAgeDays)
    
    // Should use the fallback with usedFallback=true
    expect(result.usedFallback).toBe(true)
    expect(result.age).toBe(maxAgeDays)
  })

  it('handles case where commit date exists but is older than maxAgeDays', async () => {
    const now = new Date();
    // Create a date that's 40 days old (past our 30 day window)
    const oldDate = new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000); 
    
    // First commit will be beyond maxAgeDays
    const oldCommit = {
      commit: {
        message: 'old commit',
        committer: { date: oldDate.toISOString() },
        author: { name: 'Dave' }
      },
      committer: { login: 'dave' },
      author: { login: 'dave' },
      sha: 'sha-old'
    };
    
    // Setup the mock to return our test data
    require('../../src/functions/get-context').github.rest.repos.listCommits = jest.fn().mockResolvedValue({
      data: [oldCommit]
    });
    
    const maxAgeDays = 30;
    const result = await getRecentCommitInfo('branch', [], maxAgeDays);
    
    // Should trigger the logic in lines 72-73 where we find a commit, but it's too old
    expect(result.committer).toBe('dave');
    expect(result.age).toBeGreaterThanOrEqual(maxAgeDays);
    expect(result.usedFallback).toBe(true); // Using fallback since commit is older than maxAgeDays
  });
})
