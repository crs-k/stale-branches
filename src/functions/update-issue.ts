import * as assert from 'assert'
import * as core from '@actions/core'
import {daysBeforeDelete, github, owner, repo} from './get-context'

export async function updateIssue(
  issueNumber: number,
  branch: string,
  commitAge: number
): Promise<string> {
  let createdAt: string
  const daysUntilDelete = Math.abs(commitAge - daysBeforeDelete)
  try {
    const issueResponse = await github.rest.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,

      body: `${branch} has had no activity for ${commitAge.toString()} days. \r \r This branch will be automatically deleted in ${daysUntilDelete.toString()} days. \r \r This issue was last updated on ${new Date().toString()}`,
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
    core.info(`Comment was created at ${createdAt}.`)
  } catch (err) {
    if (err instanceof Error)
      core.info(
        `No existing issue returned for issue number: ${issueNumber}. Description: ${err.message}`
      )
    createdAt = ''
  }

  return createdAt
}
