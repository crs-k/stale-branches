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
