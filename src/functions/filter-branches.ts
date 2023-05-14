import * as core from '@actions/core'
import {BranchResponse} from '../types/branches'
import {logFilterBranches} from './logging/log-filter-branches'

/**
 * Retrieves filtered list of branches
 *
 * @param {BranchResponse[]} branches A list of branches
 * @param {string} ignoreBranchesRegex A string that indicates which branches to ignore
 * @returns {BranchResponse[]} A filtered list of branches that do not meet the passed in RegEx @see {@link BranchResponse}
 */
export async function filterBranches(branches, ignoreBranchesRegex): Promise<BranchResponse[]> {
  if (ignoreBranchesRegex !== null && ignoreBranchesRegex !== '') {
    const pattern = new RegExp(`${ignoreBranchesRegex}`)
    core.info(logFilterBranches(branches.length))
    return branches.filter(branch => pattern.test(branch.branchName))
  }

  return branches
}
