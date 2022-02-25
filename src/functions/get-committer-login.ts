import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'

export async function getRecentCommitLogin(sha: string): Promise<string> {
  let lastCommitter: string | undefined
  try {
    const branchResponse = await github.rest.repos.getCommit({
      owner,
      repo,
      ref: sha,
      per_page: 1,
      page: 1
    })
    lastCommitter = branchResponse.data.committer!.login
    assert.ok(lastCommitter, 'Committer cannot be empty.')
  } catch (err) {
    if (err instanceof Error) core.info(`Failed to retrieve commit for ${sha} in ${repo}. Error: ${err.message}`)

    lastCommitter = ''
  }

  return lastCommitter
}
