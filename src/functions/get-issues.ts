import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'
// eslint-disable-next-line import/named
import {GetResponseTypeFromEndpointMethod} from '@octokit/types'

type ListIssuesResponseDataType = GetResponseTypeFromEndpointMethod<typeof github.rest.issues.listForRepo>
export async function getIssues(): Promise<ListIssuesResponseDataType> {
  let issues: ListIssuesResponseDataType

  try {
    const issueResponse = await github.rest.issues.listForRepo({
      owner,
      repo,
      state: 'open',
      labels: 'stale branch 🗑️'
    })
    issues = issueResponse

    assert.ok(issues, 'Issue ID cannot be empty')
  } catch (err) {
    if (err instanceof Error) {
      core.setFailed(`Failed to locate issues. Error: ${err.message}`)
    }
    core.setFailed(`Failed to locate issues.`)
    issues = {} as ListIssuesResponseDataType
  }

  return issues
}
