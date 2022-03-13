import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'
import {createIssueTitle} from './utils/create-issues-title'
import {logNewIssue} from './logging/log-new-issue'

export async function createIssue(branch: string, commitAge: number, lastCommitter: string, daysBeforeDelete: number, staleBranchLabel: string, tagLastCommitter: boolean): Promise<number> {
  let issueId: number
  let bodyString: string
  const daysUntilDelete = Math.max(0, daysBeforeDelete - commitAge)
  const issueTitleString = createIssueTitle(branch)

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
