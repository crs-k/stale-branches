import * as core from '@actions/core'
import {github, owner, repo} from './get-context'

/**
 * Retrieves all pull requests for a branch in a repository
 *
 * @returns {BranchResponse} A subset of data on all branches in a repository @see {@link BranchResponse}
 */
export async function getPr(branch: string): Promise<number> {
  let pullRequests = 0
  try {
    const prResponse = await github.rest.pulls.list({
      owner,
      repo,
      base: branch
    })

    pullRequests = prResponse.data.length
  } catch (err) {
    if (err instanceof Error) {
      core.setFailed(`Failed to retrieve pull requests for ${branch}. Error: ${err.message}`)
    } else {
      core.setFailed(`Failed to retrieve pull requests for ${branch}.`)
    }
    pullRequests = 0
  }

  return pullRequests
}
