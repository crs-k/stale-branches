import * as core from '@actions/core'
import {github, owner, repo} from './get-context'

/**
 * Returns the ruleset protection status for a single branch
 * @param {string} branchName
 * @returns {Promise<{hasRulesetProtection: boolean, canDelete: boolean, hasPermissionIssues: boolean}>}
 */
export async function getRulesetProtectionStatus(branchName: string): Promise<{hasRulesetProtection: boolean; canDelete: boolean; hasPermissionIssues: boolean}> {
  let hasRulesetProtection = false
  let canDelete = true
  let hasPermissionIssues = false

  try {
    const rules = await github.rest.repos.getBranchRules({owner, repo, branch: branchName})
    if (rules.data && rules.data.some(rule => (rule as any).deletion === false)) {
      hasRulesetProtection = true
      canDelete = false
    }
  } catch (err) {
    if ((err as any).status === 404) {
      // No rulesets is normal
      core.debug(`No rulesets found for ${branchName} (404 - expected when no rulesets exist)`)
    } else if ((err as any).status === 403) {
      // 403 Forbidden - token lacks required permissions
      // Log warning but continue processing rather than failing the action
      core.warning(
        `GitHub token lacks permission to read repository rulesets for ${branchName}. Please ensure your token has 'Administration' repository permissions (read). Treating as no ruleset restrictions. Error: ${(err as any).message}`
      )
      hasPermissionIssues = true
    } else {
      // Log other unexpected errors (rate limits, network issues, etc.)
      core.warning(`Failed to check rulesets for ${branchName}: ${(err as any).message || 'Unknown error'}. Treating as no ruleset restrictions.`)
    }
  }

  return {hasRulesetProtection, canDelete, hasPermissionIssues}
}
