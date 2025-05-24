import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'
import {createIssueTitleString} from './utils/create-issues-title-string'
import {logNewIssue} from './logging/log-new-issue'

/**
 * Creates a GitHub issue
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
 * @returns {number} The ID of the issue created
 */
export async function createIssue(
  branch: string,
  commitAge: number,
  lastCommitter: string,
  daysBeforeDelete: number,
  staleBranchLabel: string,
  tagLastCommitter: boolean
): Promise<number> {
  let issueId: number
  let bodyString: string
  const daysUntilDelete = Math.max(0, daysBeforeDelete - commitAge)
  const issueTitleString = createIssueTitleString(branch)

  switch (tagLastCommitter) {
    case true:
      bodyString = `@${lastCommitter}, \r \r ${branch} has had no activity for ${commitAge.toString()} days. \r \r This branch will be automatically deleted in ${daysUntilDelete.toString()} days.`
      break
    case false:
      bodyString = `${branch} has had no activity for ${commitAge.toString()} days. \r \r This branch will be automatically deleted in ${daysUntilDelete.toString()} days.`
      break
  }

  try {
    const issueResponse = await github.rest.issues.create({
      owner,
      repo,
      title: issueTitleString,
      body: bodyString,
      labels: [
        {
          name: staleBranchLabel,
          color: 'B60205',
          description: 'Used by Stale Branches Action to label issues'
        }
      ]
    })
    issueId = issueResponse.data.id
    assert.ok(issueId, 'Issue ID cannot be empty')
    core.info(logNewIssue(branch))
  } catch (err) {
    if (err instanceof Error) {
      core.setFailed(`Failed to create issue for ${branch}. Error: ${err.message}`)
    } else {
      core.setFailed(`Failed to create issue for ${branch}.`)
    }
    issueId = 0
  }

  return issueId
}
