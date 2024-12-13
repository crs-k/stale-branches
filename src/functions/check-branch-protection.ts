import * as core from '@actions/core'
import {BranchResponse} from '../types/branches'
import {github, owner, repo} from './get-context'

/**
 * Removes branches that don´t allow deletions
 */
export async function checkBranchProtection(branches: BranchResponse[]): Promise<void> {
  const branchesToRemove: BranchResponse[] = []

  for (const branch of branches) {
    try {
      const branchProtection = await github.rest.repos.getBranchProtection({
        owner,
        repo,
        branch: branch.branchName
      })
      if (!branchProtection.data.allow_deletions?.enabled) {
        //remove branch from list
        branchesToRemove.push(branch)
      }
    } catch (err) {
      if (err instanceof Error) {
        core.info(`Failed to retrieve branch protection for branch ${branch.branchName}. Error: ${err.message}`)
      } else {
        core.info(`Failed to retrieve branch protection for branch ${branch.branchName}.`)
      }
    }
  }

  // remove branches that don´t allow deletions
  for (const branch of branchesToRemove) {
    const index = branches.indexOf(branch, 0)
    if (index > -1) {
      branches.splice(index, 1)
    }
  }
}
