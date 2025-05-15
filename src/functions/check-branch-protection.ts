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

  const includeProtectedBranches = core.getInput('include-protected-branches').toLowerCase() === 'true'

  for (const branch of branches) {
    // Skip the default branch
    if (branch.branchName === defaultBranch) {
      core.info(`⚠️ Skipping default branch: ${defaultBranch}\n`)
      continue
    }

    core.startGroup(`Checking: ${branch.branchName}`)

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
    } catch (err) {
      if (err instanceof RequestError && err.status === 404) {
        // No branch protection
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
    } catch (err) {
      if (err instanceof RequestError && err.status === 404) {
        // No rulesets
      }
    }

    // Determine protection type
    let isProtected = false
    let protectionType = ''
    if (hasBranchProtection && !branchProtectionAllowsDeletion && hasRulesetProtection && !rulesetAllowsDeletion) {
      isProtected = true
      protectionType = 'branch protection and ruleset'
    } else if (hasBranchProtection && !branchProtectionAllowsDeletion) {
      isProtected = true
      protectionType = 'branch protection'
    } else if (hasRulesetProtection && !rulesetAllowsDeletion) {
      isProtected = true
      protectionType = 'ruleset'
    }

    if (isProtected) {
      if (includeProtectedBranches) {
        core.info(`✅ ${branch.branchName} is protected by ${protectionType} and is eligible for deletion`)
      } else {
        core.info(`❌ ${branch.branchName} is protected by ${protectionType} and cannot be deleted`)
        branchesToRemove.push(branch)
      }
    } else {
      core.info(`✅ ${branch.branchName} is eligible for deletion`)
    }

    core.endGroup()
    core.info('---\n')
  }

  // remove branches that don´t allow deletions
  for (const branch of branchesToRemove) {
    const index = branches.indexOf(branch, 0)
    if (index > -1) {
      branches.splice(index, 1)
    }
  }
}
