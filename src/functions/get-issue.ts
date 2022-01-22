import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'

export async function getIssue(branch: string): Promise<number> {
  let issueId: number

  try {
    const issueResponse = await github.rest.issues.listForRepo({
      owner,
      repo,
      options: {title: `[STALE] Branch: ${branch}`}
    })
    issueId = issueResponse.data[0].number || 0
    assert.ok(issueId, 'Issue ID cannot be empty')
  } catch (err) {
    if (err instanceof Error)
      core.setFailed(`Failed to locate issue for ${branch} with ${err.message}`)
    issueId = 0
  }
  core.info(`Existing Issue found with ID: ${issueId}`)
  return issueId
}
