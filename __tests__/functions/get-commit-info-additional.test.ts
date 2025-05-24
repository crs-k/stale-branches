import {getRecentCommitInfo} from '../../src/functions/get-commit-info'

// Mock the current date to be consistent in tests
const MOCK_NOW = new Date('2025-01-01T00:00:00Z').getTime()
const MOCK_DATE_30_DAYS_AGO = new Date('2024-12-02T00:00:00Z').toISOString()
const MOCK_DATE_60_DAYS_AGO = new Date('2024-11-02T00:00:00Z').toISOString()
const MOCK_DATE_90_DAYS_AGO = new Date('2024-10-03T00:00:00Z').toISOString()

// Create test commits
const testCommits = [
  {
    sha: 'sha1',
    commit: {message: 'Test commit 1', committer: {date: MOCK_DATE_30_DAYS_AGO}, author: {name: 'Test Author 1'}},
    committer: {login: 'testuser1'},
    author: {login: 'testuser1'}
  },
  {
    sha: 'sha2',
    commit: {message: 'Test commit 2', committer: {date: MOCK_DATE_60_DAYS_AGO}, author: {name: 'Test Author 2'}},
    committer: {login: 'testuser2'},
    author: {login: 'testuser2'}
  },
  {
    sha: 'sha3',
    commit: {message: 'Test commit 3', committer: {date: MOCK_DATE_90_DAYS_AGO}, author: {name: 'Test Author 3'}},
    committer: {login: 'testuser3'},
    author: {login: 'testuser3'}
  }
]

describe('getRecentCommitInfo - Additional Tests', () => {
  let originalDateNow: () => number
  let githubBackup: any

  beforeAll(() => {
    // Mock Date.now to return a consistent date
    originalDateNow = global.Date.now
    global.Date.now = jest.fn(() => MOCK_NOW)
    
    // Backup github context
    githubBackup = require('../../src/functions/get-context').github
  })
  
  afterAll(() => {
    // Restore Date.now
    global.Date.now = originalDateNow
    
    // Restore github context
    require('../../src/functions/get-context').github = githubBackup
  })
  
  beforeEach(() => {
    // Mock github client
    require('../../src/functions/get-context').github = {
      rest: {
        repos: {
          listCommits: jest.fn().mockResolvedValueOnce({data: testCommits}).mockResolvedValue({data: []})
        }
      }
    }
  })

  it('handles commits with missing committer date', async () => {
    // Create a commit with missing date
    const commitsWithMissingDate = [
      {
        sha: 'sha1',
        commit: {message: 'Test commit with missing date', committer: {}, author: {name: 'Test Author'}},
        committer: {login: 'testuser'},
        author: {login: 'testuser'}
      },
      ...testCommits
    ]
    
    require('../../src/functions/get-context').github.rest.repos.listCommits = 
      jest.fn().mockResolvedValueOnce({data: commitsWithMissingDate}).mockResolvedValue({data: []})
    
    const result = await getRecentCommitInfo('sha', [])
    
    expect(result.committer).toBe('testuser1')
    expect(result.age).toBe(30)
  })
  
  it('uses fallback age when all commits are too old and no valid commit found', async () => {
    // Set maxAgeDays to 20, which is less than any of our test commits
    const maxAgeDays = 20
    
    const result = await getRecentCommitInfo('sha', [], maxAgeDays, [])
    
    expect(result.usedFallback).toBe(true)
    expect(result.age).toBe(maxAgeDays)
  })

  it('handles case where defaultBranchShas is provided but ignoreDefaultBranchCommits is not explicitly set', async () => {
    const defaultBranchShas = new Set(['sha1'])
    
    // In this case, providing defaultBranchShas without ignoreDefaultBranchCommits should
    // not affect the result (defaultBranchShas should be ignored)
    const result = await getRecentCommitInfo('sha', [], undefined, [], defaultBranchShas, undefined)
    
    expect(result.committer).toBe('testuser1')
    expect(result.ignoredCount).toBe(0)
  })

  it('handles case where ignoreDefaultBranchCommits is true but defaultBranchShas is undefined', async () => {
    // This shouldn't throw an error but just proceed normally since there are no SHAs to ignore
    const result = await getRecentCommitInfo('sha', [], undefined, [], undefined, true)
    
    expect(result.committer).toBe('testuser1')
    expect(result.ignoredCount).toBe(0)
  })
  
  it('sets usedFallback to true when maxAgeDays is set and all commits are older', async () => {
    // Only older commits available
    const olderCommits = [
      {
        sha: 'sha4',
        commit: {message: 'Old commit', committer: {date: '2023-01-01T00:00:00Z'}, author: {name: 'Old Author'}},
        committer: {login: 'olduser'},
        author: {login: 'olduser'}
      }
    ]
    
    require('../../src/functions/get-context').github.rest.repos.listCommits = 
      jest.fn().mockResolvedValueOnce({data: olderCommits}).mockResolvedValue({data: []})
    
    const result = await getRecentCommitInfo('sha', [], 30, [])
    
    expect(result.usedFallback).toBe(true)
    expect(result.age).toBe(30)
    expect(result.committer).toBe('olduser')
  })

  it('ignores commits by different committer name formats', async () => {
    const commitsWithDifferentNameFormats = [
      {
        sha: 'sha1',
        commit: {message: 'Commit by name only', committer: {date: MOCK_DATE_30_DAYS_AGO, name: 'John Doe'}, author: {}},
        // No login field
      },
      ...testCommits
    ]
    
    require('../../src/functions/get-context').github.rest.repos.listCommits = 
      jest.fn().mockResolvedValueOnce({data: commitsWithDifferentNameFormats}).mockResolvedValue({data: []})
    
    const result = await getRecentCommitInfo('sha', [], undefined, ['John Doe'])
    
    expect(result.committer).toBe('testuser1')
    expect(result.ignoredCount).toBe(1)
  })

  it('handles empty commits response', async () => {
    require('../../src/functions/get-context').github.rest.repos.listCommits = 
      jest.fn().mockResolvedValueOnce({data: []})
    
    await expect(getRecentCommitInfo('sha', [], undefined, [])).rejects.toThrow('No non-ignored commit found')
  })

  it('paginates through multiple pages of results', async () => {
    // First page has all ignored commits, second page has valid commit
    const page1Commits = [
      {
        sha: 'sha1',
        commit: {message: 'WIP: ignore me', committer: {date: MOCK_DATE_30_DAYS_AGO}, author: {}},
        committer: {login: 'testuser1'},
      }
    ]
    
    const page2Commits = [
      {
        sha: 'sha2',
        commit: {message: 'Valid commit', committer: {date: MOCK_DATE_60_DAYS_AGO}, author: {}},
        committer: {login: 'testuser2'},
      }
    ]
    
    require('../../src/functions/get-context').github.rest.repos.listCommits = jest.fn()
      .mockResolvedValueOnce({data: page1Commits})
      .mockResolvedValueOnce({data: page2Commits})
      .mockResolvedValue({data: []})
    
    const result = await getRecentCommitInfo('sha', ['WIP'], undefined, [])
    
    expect(result.committer).toBe('testuser2')
    expect(result.age).toBe(60)
    expect(result.ignoredCount).toBe(1)
  })
})
