import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'
import {IssueResponse} from '../types/issues'

export async function getIssues(staleBranchLabel: string): Promise<IssueResponse[]> {
  let issues: IssueResponse[]

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

    assert.ok(issues, 'Issue ID cannot be empty')
  } catch (err) {
    if (err instanceof Error) {
      core.setFailed(`Failed to locate issues. Error: ${err.message}`)
    }
    core.setFailed(`Failed to locate issues.`)
    issues = [{issueTitle: '', issueNumber: -1}]
  }

  return issues
}
