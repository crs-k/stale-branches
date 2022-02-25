import * as assert from 'assert'
import * as core from '@actions/core'
import {github, maxIssues, owner, repo} from './get-context'
// eslint-disable-next-line import/named
import {GetResponseTypeFromEndpointMethod} from '@octokit/types'
import {logMaxIssues} from './logging/log-max-issues'

type ListIssuesResponseDataType = GetResponseTypeFromEndpointMethod<typeof github.rest.issues.listForRepo>
export async function getIssueBudget(): Promise<number> {
  let issues: ListIssuesResponseDataType
  let issueCount = 0
  let issueBudgetRemaining: number
  try {
    const issueResponse = await github.rest.issues.listForRepo({
      owner,
      repo,
      state: 'open',
      labels: 'stale branch 🗑️'
    })
    issues = issueResponse
    issueCount = new Set(issues.data.map(filteredIssues => filteredIssues.number)).size
    issueBudgetRemaining = Math.max(0, maxIssues - issueCount)
    assert.ok(issues, 'Issue ID cannot be empty')
  } catch (err) {
    if (err instanceof Error) {
      core.setFailed(`Failed to calculate issue budget. Error: ${err.message}`)
    }
    core.setFailed(`Failed to calculate issue budget.`)
    issueBudgetRemaining = 0
  }
  core.info(logMaxIssues(issueBudgetRemaining))
  return issueBudgetRemaining
}
