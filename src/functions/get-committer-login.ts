import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'

/**
 * Retrieves last committer's username
 *
 * @param {string} sha The SHA of the last commit
 *
 * @returns {string} The last committers username
 */
export async function getRecentCommitLogin(sha: string): Promise<string> {
  let lastCommitter: string | undefined
  try {
    const commitResponse = await github.rest.repos.getCommit({
      owner,
      repo,
      ref: sha,
      per_page: 1,
      page: 1
    })
    lastCommitter = commitResponse.data.committer!.login
    assert.ok(lastCommitter, 'Committer cannot be empty.')
  } catch (err) {
    if (err instanceof Error) {
      core.info(`Failed to retrieve commit for ${sha} in ${repo}. Error: ${err.message}`)
    } else {
      core.info(`Failed to retrieve commit for ${sha} in ${repo}.`)
    }
    lastCommitter = ''
  }

  return lastCommitter
}
