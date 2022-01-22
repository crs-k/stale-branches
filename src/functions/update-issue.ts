import * as assert from 'assert'
import * as core from '@actions/core'
import {daysBeforeDelete, github, owner, repo} from './get-context'
import {getMinutes} from './get-time'

export async function updateIssue(
  issueNumber: number,
  branch: string,
  commitAge: number
): Promise<string> {
  let createdAt: string
  const daysUntilDelete = getMinutes(commitAge, daysBeforeDelete)
  try {
    const issueResponse = await github.rest.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,

      body: `${branch} has had no activity for ${commitAge.toString()} days. This branch will be automatically deleted in ${daysUntilDelete.toString()} days. \\ This issue was last updated on ${new Date().toString()}`,
      labels: [
        {
          name: 'stale 🗑️',
          color: 'B60205',
          description: 'Used by Stale Branches Action to label issues'
        }
      ]
    })

    createdAt = issueResponse.data.created_at || ''
    assert.ok(createdAt, 'Created At cannot be empty')
  } catch (err) {
    if (err instanceof Error)
      core.info(
        `No existing issue returned for issue number: ${issueNumber}. Description: ${err.message}`
      )
    createdAt = ''
  }
  core.info(`Comment was created at ${createdAt}.`)
  return createdAt
}
