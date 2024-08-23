import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'
import {BranchResponse} from '../types/branches'
import {logGetBranches} from './logging/log-get-branches'

/**
 * Retrieves all branches in a repository
 *
 * @returns {BranchResponse} A subset of data on all branches in a repository @see {@link BranchResponse}
 */
export async function getBranches(): Promise<BranchResponse[]> {
  let branches: BranchResponse[]
  try {
    const branchResponse = await github.paginate(
      github.rest.repos.listBranches,
      {
        owner,
        repo,
        //protected: false,
        per_page: 100
      },
      response =>
        response.data.map(
          branch =>
            ({
              branchName: branch.name,
              commmitSha: branch.commit.sha
            }) as BranchResponse
        )
    )
    branches = branchResponse
  } catch (err) {
    if (err instanceof Error) {
      core.setFailed(`Failed to retrieve branches for ${repo}. Error: ${err.message}`)
    } else {
      core.setFailed(`Failed to retrieve branches for ${repo}.`)
    }
    branches = [{branchName: '', commmitSha: ''}]
  }

  const branchesToRemove: BranchResponse[] = []

  try {
    for (const branch of branches) {
      const branchProtection = await github.rest.repos.getBranchProtection({
        owner,
        repo,
        branch: branch.branchName
      })
      if (!branchProtection.data.allow_deletions?.enabled) {
        //remove branch from list
        branchesToRemove.push(branch)
      }
    }

    // remove branches that don´t allow deletions
    for (const branch of branchesToRemove) {
      const index = branches.indexOf(branch, 0)
      if (index > -1) {
        branches.splice(index, 1)
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      core.setFailed(`Failed to retrieve branch protection for ${repo}. Error: ${err.message}`)
    } else {
      core.setFailed(`Failed to retrieve branch protection for ${repo}.`)
    }
  }

  assert.ok(branches, 'Response cannot be empty.')
  core.info(logGetBranches(branches.length))
  return branches
}
