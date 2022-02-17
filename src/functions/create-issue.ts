import * as assert from 'assert'
import * as core from '@actions/core'
import {daysBeforeDelete, github, owner, repo, tagLastComitter} from './get-context'

export async function createIssue(
  branch: string,
  commitAge: number,
  lastCommitter: string
): Promise<number> {
  let issueId: number
  let bodyString: string
  const daysUntilDelete = Math.max(0, daysBeforeDelete - commitAge)

  switch (tagLastComitter) {
    case true:
      bodyString = `${lastCommitter}, \r \r ${branch} has had no activity for ${commitAge.toString()} days. \r \r This branch will be automatically deleted in ${daysUntilDelete.toString()} days.`
      break
    case false:
      bodyString = `${branch} has had no activity for ${commitAge.toString()} days. \r \r This branch will be automatically deleted in ${daysUntilDelete.toString()} days.`
      break
  }

  try {
    const issueResponse = await github.rest.issues.create({
      owner,
      repo,
      title: `[${branch}] is STALE`,
      body: bodyString,
      labels: [
        {
          name: 'stale branch 🗑️',
          color: 'B60205',
          description: 'Used by Stale Branches Action to label issues'
        }
      ]
    })
    issueId = issueResponse.data.id
    assert.ok(issueId, 'Issue ID cannot be empty')
  } catch (err) {
    if (err instanceof Error)
      core.setFailed(`Failed to create issue for ${branch}. Error: ${err.message}`)
    issueId = 0
  }

  return issueId
}
