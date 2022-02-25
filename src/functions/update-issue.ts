import * as assert from 'assert'
import * as core from '@actions/core'
import {commentUpdates, daysBeforeDelete, github, owner, repo, tagLastCommitter} from './get-context'
import styles from 'ansi-styles'

export async function updateIssue(issueNumber: number, branch: string, commitAge: number, lastCommitter: string): Promise<string> {
  let createdAt = ''
  let commentUrl: string
  let bodyString: string
  const daysUntilDelete = Math.max(0, daysBeforeDelete - commitAge)

  if (commentUpdates === true) {
    switch (tagLastCommitter) {
      case true:
        bodyString = `@${lastCommitter}, \r \r ${branch} has had no activity for ${commitAge.toString()} days. \r \r This branch will be automatically deleted in ${daysUntilDelete.toString()} days. \r \r This issue was last updated on ${new Date().toString()}`
        break
      case false:
        bodyString = `${branch} has had no activity for ${commitAge.toString()} days. \r \r This branch will be automatically deleted in ${daysUntilDelete.toString()} days. \r \r This issue was last updated on ${new Date().toString()}`
        break
    }

    try {
      const issueResponse = await github.rest.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body: bodyString,
        labels: [
          {
            name: 'stale branch 🗑️',
            color: 'B60205',
            description: 'Used by Stale Branches Action to label issues'
          }
        ]
      })

      createdAt = issueResponse.data.created_at
      commentUrl = issueResponse.data.html_url
      assert.ok(createdAt, 'Created At cannot be empty')
      core.info(
        `[${styles.blue.open}${branch}${styles.blue.close}] - Issue ${styles.yellowBright.open}#${issueNumber}${styles.yellowBright.close} comment was created at ${styles.magenta.open}${createdAt}${styles.magenta.close}. ${commentUrl}`
      )
    } catch (err) {
      if (err instanceof Error) core.info(`No existing issue returned for issue number: ${issueNumber}. Error: ${err.message}`)
      createdAt = ''
    }
  }
  return createdAt
}
