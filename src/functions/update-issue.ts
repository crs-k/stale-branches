import * as assert from 'assert'
import * as core from '@actions/core'
import {daysBeforeDelete, github, owner, repo} from './get-context'
import {getMinutes} from './get-time'

export async function updateIssue(
  issueNumber: number,
  branch: string,
  commitAge: number
): Promise<number> {
  let issueId: number
  const daysUntilDelete = getMinutes(commitAge, daysBeforeDelete)
  try {
    const issueResponse = await github.rest.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      options: {
        title: `[STALE] Branch: ${branch}`,
        body: `${branch} has had no activity for ${commitAge.toString()} days. This branch will be automatically deleted in ${daysUntilDelete.toString()} days.`,
        labels: [
          {
            name: 'stale 🗑️',
            color: 'B60205',
            description: 'Used by Stale Branches Action to label issues'
          }
        ]
      }
    })
    issueId = issueResponse.data.id || 0
    assert.ok(issueId, 'Date cannot be empty')
  } catch (err) {
    if (err instanceof Error)
      core.info(
        `No existing issue returned for stale branch: ${branch}. Description: ${err.message}`
      )
    issueId = 0
  }

  return issueId
}
