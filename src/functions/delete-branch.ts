import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'
import {logDeleteBranch} from './logging/log-delete-branch'

/**
 * Deletes a branch in a repository
 *
 * @param {string} name The name of a branch.
 *
 * @returns {number} HTTP response code (ex: 204)
 */
export async function deleteBranch(name: string): Promise<number> {
  let confirm: number
  const refAppend = 'heads/'
  const refFull = refAppend.concat(name)

  try {
    // Deletes branch based on it's ref
    const response = await github.rest.git.deleteRef({
      owner,
      repo,
      ref: refFull
    })
    confirm = response.status

    assert.ok(response, 'response cannot be empty')
    core.info(logDeleteBranch(refFull))
  } catch (err) {
    if (err instanceof Error) {
      core.error(`Failed to delete branch ${refFull}. Error: ${err.message}`)
    } else {
      core.error(`Failed to delete branch ${refFull}.`)
    }
    confirm = 500
  }

  return confirm
}
