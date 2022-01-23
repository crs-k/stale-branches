import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'

export async function deleteBranch(name: string): Promise<string> {
  core.info('Retrieving branch information...')
  let confirm: string
  const refAppend = 'heads/'
  const refFull = refAppend.concat(name)

  try {
    // Get info from the most recent release
    const response = await github.rest.git.deleteRef({
      owner,
      repo,
      ref: refFull
    })
    confirm = response.data[0]

    assert.ok(response, 'name cannot be empty')
    core.warning(`Branch: ${refFull} has been deleted.`)
  } catch (err) {
    if (err instanceof Error) core.setFailed(`Failed to delete branch ${refFull}:  ${err.message}`)
    confirm = ''
  }

  return confirm
}
