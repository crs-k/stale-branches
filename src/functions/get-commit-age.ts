import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'
import {getDays} from './utils/get-time'

/**
 * Calcualtes the age of a commit in days
 *
 * @param {string} sha The SHA of the last commit
 *
 * @returns {number} The age of the commit
 */
export async function getRecentCommitAge(sha: string): Promise<number> {
  let commitDate: string | undefined
  const currentDate = Date.now()

  try {
    const commitResponse = await github.rest.repos.getCommit({
      owner,
      repo,
      ref: sha,
      per_page: 1,
      page: 1
    })
    commitDate = commitResponse.data.commit.committer!.date
    assert.ok(commitDate, 'Date cannot be empty.')
  } catch (err) {
    if (err instanceof Error) {
      core.setFailed(`Failed to retrieve commit for ${sha} in ${repo}. Error: ${err.message}`)
    } else {
      core.setFailed(`Failed to retrieve commit for ${sha} in ${repo}.`)
    }
    commitDate = ''
  }

  const commitDateTime = new Date(commitDate).getTime()
  const commitAge = getDays(currentDate, commitDateTime)

  return commitAge
}

/**
 * Calculates the age of the most recent commit not matching any ignored commit messages, up to a max age.
 *
 * @param {string} sha The SHA of the branch head
 * @param {string[]} ignoredMessages Array of commit messages or substrings to ignore
 * @param {number} [maxAgeDays] Optional. If provided, stop searching if a commit is older than this many days.
 *
 * @returns {number} The age of the most recent non-ignored commit, or maxAgeDays if none found within that range
 */
export async function getRecentCommitAgeByNonIgnoredMessage(sha: string, ignoredMessages: string[], maxAgeDays?: number): Promise<number> {
  const currentDate = Date.now()
  let page = 1
  let commitDate: string | undefined
  let found = false

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
      // If maxAgeDays is set and this commit is older than the threshold, stop searching
      if (maxAgeDays !== undefined && commitAge > maxAgeDays) {
        // If we haven't found a valid commit yet, return maxAgeDays
        if (!commitDate) {
          return maxAgeDays
        } else {
          // We already found a valid commit in this or a previous page, break out
          found = true
          break
        }
      }
      if (ignoredMessages.some(msg => message.includes(msg))) {
        continue
      }
      // Found a valid commit within the window
      commitDate = commitDateStr
      found = true
      break
    }
    if (found) break
    page++
  }
  if (commitDate) {
    const commitDateTime = new Date(commitDate).getTime()
    return getDays(currentDate, commitDateTime)
  }
  throw new Error('No non-ignored commit found')
}
