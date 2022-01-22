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
  let updatedAt: string
  const daysUntilDelete = getMinutes(commitAge, daysBeforeDelete)
  try {
    const issueResponse = await github.rest.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      options: {
        body: `${branch} has had no activity for ${commitAge.toString()} days. This branch will be automatically deleted in ${daysUntilDelete.toString()} days. This issue was last updated on ${new Date().toString()}`,
        labels: [
          {
            name: 'stale 🗑️',
            color: 'B60205',
            description: 'Used by Stale Branches Action to label issues'
          }
        ]
      }
    })

    issueId = issueResponse.data.number || 0
    updatedAt = issueResponse.data.updated_at || ''
    assert.ok(issueId, 'Date cannot be empty')
  } catch (err) {
    if (err instanceof Error)
      core.info(
        `No existing issue returned for issue number: ${issueNumber}. Description: ${err.message}`
      )
    issueId = 0
    updatedAt = 'Never'
  }
  core.info(`Issue ${issueId} was updated at ${updatedAt}`)
  return issueId
}
