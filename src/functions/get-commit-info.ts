import {github, owner, repo} from './get-context'
import {getDays} from './utils/get-time'

/**
 * Retrieves the most recent non-ignored commit's committer and age.
 *
 * @param {string} sha The SHA of the branch head
 * @param {string[]} [ignoredMessages] Array of commit messages or substrings to ignore
 * @param {number} [maxAgeDays] Optional. If provided, stop searching if a commit is older than this many days.
 * @param {string[]} [ignoredCommitters] Optional. List of committer usernames/names to ignore.
 * @param {Set<string>} [defaultBranchShas] Optional. Set of commit SHAs from the default branch to ignore if ignoreDefaultBranchCommits is true.
 * @param {boolean} [ignoreDefaultBranchCommits] Optional. If true, ignore commits also present in the default branch.
 *
 * @returns {{ committer: string, age: number, ignoredCount: number, usedFallback: boolean, sha?: string }}
 */
export async function getRecentCommitInfo(
  sha: string,
  ignoredMessages: string[] = [],
  maxAgeDays?: number,
  ignoredCommitters?: string[],
  defaultBranchShas?: Set<string>,
  ignoreDefaultBranchCommits?: boolean
): Promise<{committer: string; age: number; ignoredCount: number; usedFallback: boolean; sha?: string}> {
  const currentDate = Date.now()
  let page = 1
  let commitDate: string | undefined
  let found = false
  let ignoredCount = 0
  let usedFallback = false
  let committer = 'Unknown'
  let foundSha: string | undefined = undefined

  while (!found) {
    const commitsResponse = await github.rest.repos.listCommits({
      owner,
      repo,
      sha,
      per_page: 100,
      page
    })
    if (commitsResponse.data.length === 0) break
    for (const commit of commitsResponse.data) {
      const message = commit.commit?.message || ''
      const commitDateStr = commit.commit?.committer?.date
      if (!commitDateStr) continue
      const commitDateTime = new Date(commitDateStr).getTime()
      const commitAge = getDays(currentDate, commitDateTime)
      committer =
        commit.committer?.login ||
        commit.author?.login ||
        commit.commit?.committer?.name ||
        commit.commit?.author?.name ||
        'Unknown'
      // Ignore by SHA (default branch), if within window
      if (ignoreDefaultBranchCommits && defaultBranchShas?.has(commit.sha)) {
        if (maxAgeDays === undefined || commitAge <= maxAgeDays) {
          ignoredCount++
          continue
        }
      }
      // Ignore by message or committer
      if (
        ignoredMessages.some(msg => message.includes(msg)) ||
        (ignoredCommitters?.length &&
          ignoredCommitters.some(ignored => ignored && committer && committer.toLowerCase() === ignored.toLowerCase()))
      ) {
        ignoredCount++
        continue
      }
      // Only now check if commit is too old
      if (maxAgeDays !== undefined && commitAge > maxAgeDays) {
        if (!commitDate) {
          usedFallback = true
          return {committer, age: maxAgeDays, ignoredCount, usedFallback}
        } else {
          found = true
          break
        }
      }
      // Found a valid commit within the window
      commitDate = commitDateStr
      foundSha = commit.sha
      found = true
      break
    }
    if (found) break
    page++
  }
  if (commitDate) {
    const commitDateTime = new Date(commitDate).getTime()
    const age = getDays(currentDate, commitDateTime)
    return {committer, age, ignoredCount, usedFallback, sha: foundSha}
  }
  throw new Error('No non-ignored commit found')
}
