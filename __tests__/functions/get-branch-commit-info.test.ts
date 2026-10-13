import {getBranchCommitInfo} from '../../src/functions/get-branch-commit-info'

const day = 24 * 60 * 60 * 1000
const at = (daysAgo: number) => new Date(Date.now() - daysAgo * day).toISOString()
const commit = (sha: string, message: string, daysAgo: number, login = 'dev') => ({
  sha,
  commit: {message, committer: {date: at(daysAgo)}},
  committer: {login},
  author: {login}
})

// compareCommitsWithBasehead returns branch-only commits oldest first, 100 per page
function mockApi(branchOnly: ReturnType<typeof commit>[], tip?: ReturnType<typeof commit>) {
  const compareCommitsWithBasehead = jest.fn(async ({page}: {page: number}) => ({
    data: {total_commits: branchOnly.length, commits: branchOnly.slice((page - 1) * 100, page * 100)}
  }))
  const getCommit = jest.fn(async () => ({data: tip}))
  require('../../src/functions/get-context').github = {rest: {repos: {compareCommitsWithBasehead, getCommit}}}
  return {compareCommitsWithBasehead, getCommit}
}

describe('getBranchCommitInfo', () => {
  let githubBackup: unknown
  beforeAll(() => {
    githubBackup = require('../../src/functions/get-context').github
  })
  afterAll(() => {
    require('../../src/functions/get-context').github = githubBackup
  })

  it('compares the branch against the default branch', async () => {
    const api = mockApi([commit('a', 'fix: work', 3)])
    await getBranchCommitInfo('tip-sha', 'main', [], [])
    expect(api.compareCommitsWithBasehead).toHaveBeenCalledWith(expect.objectContaining({basehead: 'main...tip-sha', per_page: 100, page: 1}))
  })

  it('returns the newest branch-only commit that passes the filters', async () => {
    mockApi([commit('old-work', 'fix: work', 300), commit('bot', 'GitHub WoBo Action Autoupdate merged', 2, 'bot')])
    const info = await getBranchCommitInfo('tip', 'main', ['Autoupdate merged'], [])
    expect(info).toMatchObject({sha: 'old-work', age: 300, committer: 'dev', ignoredCount: 1, usedFallback: false})
  })

  it('ignores branch-only commits by committer', async () => {
    mockApi([commit('work', 'fix: work', 250), commit('bot', 'chore: bump', 1, 'renovate')])
    const info = await getBranchCommitInfo('tip', 'main', [], ['Renovate'])
    expect(info).toMatchObject({sha: 'work', age: 250})
  })

  it('does not reach into default-branch history for a young branch whose own commits are all filtered', async () => {
    // Regression: a release branch cut two days ago carrying only a PR merge was read as the age
    // of an ancient default-branch commit and deleted.
    mockApi([commit('merge', 'Merge pull request #1 from org/feature', 2)])
    const info = await getBranchCommitInfo('tip', 'main', ['Merge pull request'], [])
    expect(info).toMatchObject({age: 2, usedFallback: false, allBranchCommitsIgnored: true, ignoredCount: 1})
  })

  it('keeps an abandoned branch deletable when only filtered commits have touched it since', async () => {
    mockApi([commit('first', 'GitHub WoBo Action Autoupdate merged', 400), commit('latest', 'GitHub WoBo Action Autoupdate merged', 1)])
    const info = await getBranchCommitInfo('tip', 'main', ['Autoupdate merged'], [])
    expect(info).toMatchObject({age: 400, usedFallback: false, allBranchCommitsIgnored: true, ignoredCount: 2})
  })

  it('uses the tip commit age for a branch with no commits of its own', async () => {
    const api = mockApi([], commit('tip', 'feat: on main', 10))
    const info = await getBranchCommitInfo('tip', 'main', ['Merge pull request'], [])
    expect(api.getCommit).toHaveBeenCalledWith(expect.objectContaining({ref: 'tip'}))
    expect(info).toMatchObject({sha: 'tip', age: 10, usedFallback: false, ignoredCount: 0})
  })

  it('lets a branch with no commits of its own expire once its tip passes the TTL', async () => {
    mockApi([], commit('tip', 'feat: on main', 400))
    const info = await getBranchCommitInfo('tip', 'main', [], [])
    expect(info.age).toBe(400)
  })

  it('reads the newest page first when the comparison spans several pages', async () => {
    const branchOnly = [...Array.from({length: 149}, (_, i) => commit(`c${i}`, 'fix: work', 400 - i)), commit('newest', 'fix: newest', 5)]
    const api = mockApi(branchOnly)
    const info = await getBranchCommitInfo('tip', 'main', [], [])
    expect(info).toMatchObject({sha: 'newest', age: 5})
    expect(api.compareCommitsWithBasehead.mock.calls.map(([args]) => args.page)).toEqual([1, 2])
  })

  it('walks back across pages and falls back to the oldest branch-only commit', async () => {
    const branchOnly = Array.from({length: 150}, (_, i) => commit(`c${i}`, 'Merge pull request', 300 - i))
    const api = mockApi(branchOnly)
    const info = await getBranchCommitInfo('tip', 'main', ['Merge pull request'], [])
    expect(info).toMatchObject({sha: 'c0', age: 300, usedFallback: false, allBranchCommitsIgnored: true, ignoredCount: 150})
    expect(api.compareCommitsWithBasehead.mock.calls.map(([args]) => args.page)).toEqual([1, 2])
  })
})
