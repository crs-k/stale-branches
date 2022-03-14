import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'
import {BranchComparison} from '../types/branch-comparison'
import {CompareBranchesEnum} from '../enums/input-compare-branches'
import {getDefaultBranch} from './get-default-branch'
import {logCompareBranches} from './logging/log-compare-branches'

/**
 * Compares HEAD branch to BASE branch
 *
 * @param {string} head The name of the head branch
 *
 * @param {string} inputCompareBranches The value from the compare-branches input
 *
 * @returns {BranchComparison} The status of the HEAD branch vs. BASE branch @see {@link BranchComparison}
 */
export async function compareBranches(head: string, inputCompareBranches: string): Promise<BranchComparison> {
  const branchComparison = {} as unknown as BranchComparison
  branchComparison.save = false
  if (inputCompareBranches !== CompareBranchesEnum.off) {
    const base = await getDefaultBranch()
    const refAppend = 'heads/'
    const baseFull = refAppend.concat(base)
    const headFull = refAppend.concat(head)
    const basehead = `${baseFull}...${headFull}`
    try {
      const branchComparisonResponse = await github.rest.repos.compareCommitsWithBasehead({
        owner,
        repo,
        basehead
      })

      if (inputCompareBranches === CompareBranchesEnum.save && (branchComparisonResponse.data.status === 'ahead' || branchComparisonResponse.data.status === 'diverged')) {
        branchComparison.save = true
      }

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
  }
  return branchComparison
}
