import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'

export async function deleteBranch(name: string): Promise<string> {
  core.info('Retrieving branch information...')
  let confirm: string

  try {
    // Get info from the most recent release
    const response = await github.rest.git.deleteRef({
      owner,
      repo,
      ref: name
    })
    confirm = response.data[0]
    core.warning(`Branch: ${name} has been deleted.`)
    assert.ok(response, 'name cannot be empty')
  } catch (err) {
    if (err instanceof Error) core.setFailed(`Failed to delete branch ${name}:  ${err.message}`)
    confirm = ''
  }

  return confirm
}
