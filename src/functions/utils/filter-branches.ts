import * as core from '@actions/core'
import {BranchResponse} from '../../types/branches'
import {logFilterBranches} from '../logging/log-filter-branches'

/**
 * Retrieves filtered list of branches
 *
 * @param {BranchResponse[]} branches A list of branches
 * @param {string} branchesFilterRegex A RegExp string that indicates which branches to include
 * @returns {BranchResponse[]} A filtered list of branches that meet the passed in RegEx @see {@link BranchResponse}
 */
export async function filterBranches(
  branches: BranchResponse[],
  branchesFilterRegex: string | undefined
): Promise<BranchResponse[]> {
  if (branchesFilterRegex && branchesFilterRegex !== '') {
    const pattern = new RegExp(`${branchesFilterRegex}`)
    const filteredBranches = branches.filter((branch: BranchResponse) => pattern.test(branch.branchName))
    core.info(logFilterBranches(filteredBranches.length))
    return filteredBranches
  }

  return branches
}
