import * as assert from 'assert'
import * as core from '@actions/core'
import {daysBeforeDelete, github, owner, repo} from './get-context'
import {getMinutes} from './get-time'

export async function createIssue(branch: string, commitAge: number): Promise<string> {
  let issueUrl: string
  const daysUntilDelete = getMinutes(commitAge, daysBeforeDelete)
  try {
    const issueResponse = await github.rest.issues.create({
      owner,
      repo,
      title: `[STALE] Branch: ${branch}`,
      body: `${branch} has had no activity in ${commitAge.toString()} days. This branch will be automatically deleted in ${daysUntilDelete.toString()} days.`
    })
    issueUrl = issueResponse.data.url || ''
    assert.ok(issueUrl, 'Date cannot be empty')
  } catch (err) {
    if (err instanceof Error)
      core.setFailed(`Failed to create issue for ${branch} with ${err.message}`)
    issueUrl = ''
  }

  return issueUrl
}
