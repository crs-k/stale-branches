import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'
import {createCommentString} from './utils/create-comment-string'
import {logUpdateIssue} from './logging/log-update-issue'

/**
 * @description
 * Creates comment on existing GitHub issue
 *
 * @param {number} issueNumber GitHub issue number
 *
 * @param {string} branch The branch currently being worked on
 *
 * @param {number} commitAge The age (in days) of the last commit to a branch
 *
 * @param {string} lastCommitter The username that last committed to the branch
 *
 * @param {number} daysBeforeDelete The amount of days before a branch is to be deleted
 *
 * @param {string} staleBranchLabel The label to be used to identify issues related to this Action
 *
 * @param {boolean} tagLastCommitter If true, the user that last committed to this branch will be tagged
 *
 * @return {string} `createdAt` - The time the comment was created
 */
export async function createIssueComment(
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
    bodyString = createCommentString(branch, lastCommitter, commitAge, daysBeforeDelete, commentUpdates, tagLastCommitter)

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
