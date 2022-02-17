import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'

export async function getRecentCommitDate(sha: string): Promise<string> {
  let commitDate: string | undefined
  let lastCommitter: string | undefined
  try {
    const branchResponse = await github.rest.repos.getCommit({
      owner,
      repo,
      ref: sha,
      per_page: 1,
      page: 1
    })
    commitDate = branchResponse.data.commit.committer!.date
    lastCommitter = branchResponse.data.committer!.login
    assert.ok(commitDate, 'Date cannot be empty.')
    assert.ok(lastCommitter, 'Committer cannot be empty.')
  } catch (err) {
    if (err instanceof Error)
      core.setFailed(`Failed to retrieve commit for ${repo}. Error: ${err.message}`)
    commitDate = ''
  }

  return commitDate
}
