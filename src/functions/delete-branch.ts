import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'

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

    assert.ok(response, 'name cannot be empty')
    core.notice(`Branch: ${refFull} has been deleted.`)
  } catch (err) {
    if (err instanceof Error) core.error(`Failed to delete branch ${refFull}:  ${err.message}`)
    confirm = 500
  }

  return confirm
}
