import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'
import {BranchComparison} from '../types/branch-comparison'
import {getDefaultBranch} from './get-default-branch'
import {logCompareBranches} from './logging/log-compare-branches'

export async function compareBranches(head: string): Promise<BranchComparison> {
  const branchComparison = {} as unknown as BranchComparison
  const base = await getDefaultBranch()
  const basehead = `${base}${head}`
  try {
    const branchComparisonResponse = await github.rest.repos.compareCommitsWithBasehead({
      owner,
      repo,
      basehead
    })

    branchComparison.aheadBy = branchComparisonResponse.data.ahead_by
    branchComparison.behindBy = branchComparisonResponse.data.behind_by
    branchComparison.branchStatus = branchComparisonResponse.data.status
    branchComparison.totalCommits = branchComparisonResponse.data.total_commits

    assert.ok(branchComparison.branchStatus, 'Branch Comparison Status cannot be empty.')
    core.info(logCompareBranches(branchComparison, base, head))
  } catch (err) {
    if (err instanceof Error) {
      core.info(`Failed to retrieve branch comparison data. Error: ${err.message}`)
    } else {
      core.info(`Failed to retrieve branch comparison data.`)
    }
  }

  return branchComparison
}
