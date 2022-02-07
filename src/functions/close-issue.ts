import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'

export async function closeIssue(issueNumber: number): Promise<string> {
  let state: string

  try {
    const issueResponse = await github.rest.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      state: 'closed'
    })

    state = issueResponse.data.state || ''
    assert.ok(state, 'Created At cannot be empty')
    core.info(` Issue #${issueNumber}'s state was changed to ${state}.`)
  } catch (err) {
    if (err instanceof Error)
      core.info(
        `No existing issue returned for issue number: ${issueNumber}. Description: ${err.message}`
      )
    state = ''
  }
  return state
}
