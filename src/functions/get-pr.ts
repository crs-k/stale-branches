import * as core from '@actions/core'
import {github, owner, repo} from './get-context'

/**
 * Retrieves all pull requests for a branch in a repository
 *
 * @returns {pullRequests} A count of active pull requests for a branch
 */
export async function getPr(branch: string): Promise<number> {
  let pullRequests = 0
  try {
    const prResponse = await github.rest.pulls.list({
      owner,
      repo,
      base: branch,
      draft: true
    })

    pullRequests = prResponse.data.length
    core.info(`Number of pull requests for branch ${branch}: ${pullRequests}`)
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
