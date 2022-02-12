import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'

export async function getRecentCommitDate(sha: string): Promise<string> {
  let commitDate: string
  try {
    const branchResponse = await github.rest.repos.getCommit({
      owner,
      repo,
      ref: sha,
      per_page: 1,
      page: 1
    })
    commitDate = branchResponse.data.commit.author?.date || ''
    assert.ok(commitDate, 'Date cannot be empty.')
  } catch (err) {
    if (err instanceof Error)
      core.setFailed(`Failed to retrieve commit for ${repo}. Error: ${err.message}`)
    commitDate = ''
  }

  return commitDate
}
