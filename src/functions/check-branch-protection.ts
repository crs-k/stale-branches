import * as core from '@actions/core'
import {BranchResponse} from '../types/branches'
import {github, owner, repo} from './get-context'
import {RulesetResponse} from '../types/github-api'
import {RequestError} from '@octokit/request-error'

/**
 * Removes branches that don´t allow deletions
 */
export async function checkBranchProtection(branches: BranchResponse[]): Promise<void> {
  const branchesToRemove: BranchResponse[] = []

  // Get the default branch from the repository
  let defaultBranch: string
  try {
    const repoInfo = await github.rest.repos.get({
      owner,
      repo
    })
    defaultBranch = repoInfo.data.default_branch
    core.info(`Default branch: ${defaultBranch}\n`)
  } catch (err) {
    core.warning(`Failed to fetch default branch: ${err instanceof Error ? err.message : 'Unknown error'}`)
    return
  }

  for (const branch of branches) {
    // Skip the default branch
    if (branch.branchName === defaultBranch) {
      core.info(`⚠️ Skipping default branch: ${defaultBranch}\n`)
      continue
    }

    core.info(`Checking: ${branch.branchName}`)

    let hasBranchProtection = false
    let branchProtectionAllowsDeletion = false
    let hasRulesetProtection = false
    let rulesetAllowsDeletion = false

    // Check branch protection
    try {
      const branchProtection = await github.rest.repos.getBranchProtection({
        owner,
        repo,
        branch: branch.branchName
      })

      hasBranchProtection = true
      branchProtectionAllowsDeletion = branchProtection.data.allow_deletions?.enabled ?? false
      core.info(`Protection: ${branchProtectionAllowsDeletion ? '✅ allows deletion' : '❌ prevents deletion'}`)
    } catch (err) {
      if (err instanceof RequestError && err.status === 404) {
        core.info('Protection: None')
      }
    }

    // Check rulesets
    try {
      const rulesets = (await github.rest.repos.getBranchRules({
        owner,
        repo,
        branch: branch.branchName
      })) as RulesetResponse

      hasRulesetProtection = rulesets.data.length > 0
      rulesetAllowsDeletion = !rulesets.data.some(ruleset => !ruleset.deletion)
      core.info(`Rulesets: ${hasRulesetProtection ? `${rulesets.data.length} found` : 'None'}`)
    } catch (err) {
      if (err instanceof RequestError && err.status === 404) {
        core.info('Rulesets: None')
      }
    }

    // If either protection system prevents deletion, remove the branch
    if ((hasBranchProtection && !branchProtectionAllowsDeletion) || (hasRulesetProtection && !rulesetAllowsDeletion)) {
      core.info(`❌ ${branch.branchName} is protected and cannot be deleted\n---\n`)
      branchesToRemove.push(branch)
    } else {
      core.info(`✅ ${branch.branchName} is eligible for deletion\n---\n`)
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
