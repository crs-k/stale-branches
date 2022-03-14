import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'

/**
 * Retrieves the default branch for the repository
 *
 * @return {string} The default branch
 */
export async function getDefaultBranch(): Promise<string> {
  let result: string
  try {
    // Get the default branch from the repo info
    const response = await github.rest.repos.get({owner, repo})
    result = response.data.default_branch
    assert.ok(result, 'default_branch cannot be empty')
  } catch (err) {
    // Handle .wiki repo
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((err as any)?.status === 404 && repo.toUpperCase().endsWith('.WIKI')) {
      result = 'main'
    }
    // Otherwise error
    else {
      if (err instanceof Error) core.setFailed(`Failed to get default branch: ${err.message}`)
      result = ''
    }
  }

  return result
}
