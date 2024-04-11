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
    // Check for incoming PRs
    const incomingPrResponse = await github.rest.pulls.list({
      owner,
      repo,
      base: branch
    })

    // Check for outgoing PRs
    const outgoingPrResponse = await github.rest.pulls.list({
      owner,
      repo,
      head: `${owner}:${branch}`
    })

    pullRequests = incomingPrResponse.data.length + outgoingPrResponse.data.length

    // Log incoming PRs
    // eslint-disable-next-line github/array-foreach
    incomingPrResponse.data.forEach(pr => {
      core.info(`Incoming PR: ${pr.title}, Draft: ${pr.draft}`)
    })

    // Log outgoing PRs
    // eslint-disable-next-line github/array-foreach
    outgoingPrResponse.data.forEach(pr => {
      core.info(`Outgoing PR: ${pr.title}, Draft: ${pr.draft}`)
    })
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
