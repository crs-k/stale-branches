import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'
import {createIssueComment} from '../utils/create-issues-comment'
import {logUpdateIssue} from './logging/log-update-issue'

export async function updateIssue(
  issueNumber: number,
  branch: string,
  commitAge: number,
  lastCommitter: string,
  commentUpdates: boolean,
  daysBeforeDelete: number,
  staleBranchLabel: string,
  tagLastCommitter: boolean
): Promise<string> {
  let createdAt = ''
  let commentUrl: string
  let bodyString: string

  if (commentUpdates === true) {
    bodyString = createIssueComment(branch, lastCommitter, commitAge, daysBeforeDelete, commentUpdates, tagLastCommitter)

    try {
      const issueResponse = await github.rest.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body: bodyString,
        labels: [
          {
            name: staleBranchLabel,
            color: 'B60205',
            description: 'Used by Stale Branches Action to label issues'
          }
        ]
      })

      createdAt = issueResponse.data.created_at
      commentUrl = issueResponse.data.html_url
      assert.ok(createdAt, 'Created At cannot be empty')
      core.info(logUpdateIssue(issueNumber, createdAt, commentUrl))
    } catch (err) {
      if (err instanceof Error) core.info(`No existing issue returned for issue number: ${issueNumber}. Error: ${err.message}`)
      createdAt = ''
    }
  }
  return createdAt
}
