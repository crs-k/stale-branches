import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'
import {IssueResponse} from '../types/issues'
import {logMaxIssues} from './logging/log-max-issues'

export async function getIssueBudget(maxIssues: number, staleBranchLabel: string): Promise<number> {
  let issues: IssueResponse[]
  let issueCount = 0
  let issueBudgetRemaining: number
  try {
    const issueResponse = await github.paginate(
      github.rest.issues.listForRepo,
      {
        owner,
        repo,
        state: 'open',
        labels: staleBranchLabel,
        per_page: 100
      },
      response => response.data.map(issue => ({issueTitle: issue.title, issueNumber: issue.number} as IssueResponse))
    )
    issues = issueResponse
    issueCount = new Set(issues.map(filteredIssues => filteredIssues.issueNumber)).size
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
