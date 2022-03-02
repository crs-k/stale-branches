import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'

export async function closeIssueComment(issueNumber: number, branch: string, closeReason: string): Promise<string> {
  let createdAt = ''
  const bodyString = `This issue was closed because ${branch} ${closeReason}`

  try {
    const issueResponse = await github.rest.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body: bodyString
    })

    createdAt = issueResponse.data.created_at
    assert.ok(createdAt, 'Created At cannot be empty')
  } catch (err) {
    if (err instanceof Error) core.info(`No existing issue returned for issue number: ${issueNumber}. Error: ${err.message}`)
    createdAt = ''
  }

  return createdAt
}
