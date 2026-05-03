import * as core from '@actions/core'
import {github, owner, repo} from './get-context'
import {getRulesetProtectionStatus} from './get-ruleset-protection'

/**
 * Returns the protection status for a single branch
 * @param {string} branchName
 * @returns {Promise<{isProtected: boolean, protectionType: string, canDelete: boolean}>}
 */
export async function getBranchProtectionStatus(
  branchName: string,
  includeProtectedBranches: boolean,
  includeRulesetBranches: boolean
): Promise<{isProtected: boolean; protectionType: string; canDelete: boolean}> {
  let defaultBranch: string
  try {
    const repoInfo = await github.rest.repos.get({owner, repo})
    defaultBranch = repoInfo.data.default_branch
  } catch {
    return {isProtected: false, protectionType: '', canDelete: true}
  }

  if (branchName === defaultBranch) {
    return {isProtected: true, protectionType: 'default branch', canDelete: false}
  }

  let isProtected = false
  let protectionType = ''
  let canDelete = true
  let hasPermissionIssues = false
  let hasBranchProtection = false
  let hasRulesetProtection = false

  // Check branch protection only if includeProtectedBranches is true
  if (includeProtectedBranches) {
    try {
      const protection = await github.rest.repos.getBranchProtection({owner, repo, branch: branchName})
      // If we get here (no 404), the branch HAS protection rules
      hasBranchProtection = true
      isProtected = true
      protectionType = 'branch protection'
      // Check if deletions are explicitly allowed despite protection
      if (protection.data?.allow_deletions?.enabled) {
        // Branch protection allows deletions
        canDelete = true
      } else {
        // Branch protection prevents deletions
        canDelete = false
      }
    } catch (err) {
      const httpErr = err as {status?: number; message?: string}
      if (httpErr.status === 404) {
        // 404 means no branch protection exists - branch is unprotected
        // This is the expected case for unprotected branches
        core.debug(`No branch protection found for ${branchName} (404 - expected for unprotected branches)`)
      } else if (httpErr.status === 403) {
        // 403 Forbidden - token lacks required permissions
        // Log warning but continue processing rather than failing the action
        core.warning(
          `GitHub token lacks permission to read branch protection for ${branchName}. Please ensure your token has 'Administration' repository permissions (read). Treating as unprotected. Error: ${httpErr.message}`
        )
        hasPermissionIssues = true
      } else {
        // Log other unexpected errors (rate limits, network issues, etc.)
        core.warning(`Failed to check branch protection for ${branchName}: ${httpErr.message ?? 'Unknown error'}. Treating as unprotected.`)
      }
    }
  }

  // Check rulesets only if includeRulesetBranches is true
  if (includeRulesetBranches) {
    const rulesetStatus = await getRulesetProtectionStatus(branchName)
    hasRulesetProtection = rulesetStatus.hasRulesetProtection
    if (hasRulesetProtection) {
      protectionType = protectionType ? `${protectionType} and ruleset` : 'ruleset'
      isProtected = true
      canDelete = rulesetStatus.canDelete
    }
    if (rulesetStatus.hasPermissionIssues) {
      hasPermissionIssues = true
    }
  }

  // Determine if deletion is allowed based on protection status and include settings
  if (isProtected) {
    // If protection rules themselves prevent deletion, check include settings
    if (!canDelete) {
      if (hasBranchProtection && includeProtectedBranches) {
        canDelete = true
      }
      if (hasRulesetProtection && includeRulesetBranches) {
        canDelete = true
      }
    }
    // If protection rules allow deletion, keep canDelete as true (don't override)
  }

  // If we had permission issues, add a note to the protection type for transparency
  if (hasPermissionIssues && protectionType === '') {
    protectionType = 'unknown (permission denied)'
  } else if (hasPermissionIssues) {
    protectionType += ' (partial check - permission denied)'
  }

  return {isProtected, protectionType, canDelete}
}

/**
 * @deprecated Use getBranchProtectionStatus in the main branch loop instead.
 */
