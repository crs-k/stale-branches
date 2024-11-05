import * as core from '@actions/core'
import {BranchResponse} from '../types/branches'
import {github, owner, repo} from './get-context'

/**
 * Removes branches that don´t allow deletions
 */
export async function checkBranchProtection(branches: BranchResponse[]) {
  core.info(`branches before protection check: ${branches.length}`)

  const branchesToRemove: BranchResponse[] = []

  for (const branch of branches) {
    core.info(`get branch protection for branch: ${branch.branchName}`)
    try {
      const branchProtection = await github.rest.repos.getBranchProtection({
        owner,
        repo,
        branch: branch.branchName
      })
      core.info('branch protection: ' + branchProtection)
      if (!branchProtection.data.allow_deletions?.enabled) {
        //remove branch from list
        branchesToRemove.push(branch)
        core.info('branch to remove: ' + branch.branchName)
      }
    } catch (err) {
      if (err instanceof Error) {
        core.info(`Failed to retrieve branch protection for branch ${branch.branchName}. Error: ${err.message}`)
      } else {
        core.info(`Failed to retrieve branch protection for branch ${branch.branchName}.`)
      }
    }
  }

  core.info('branches to remove: ' + branchesToRemove.length)

  // remove branches that don´t allow deletions
  for (const branch of branchesToRemove) {
    const index = branches.indexOf(branch, 0)
    if (index > -1) {
      branches.splice(index, 1)
    }
  }
}
