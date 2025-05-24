import * as core from '@actions/core'
import {github, owner, repo} from './get-context'

/**
 * Returns the protection status for a single branch
 * @param {string} branchName
 * @returns {Promise<{isProtected: boolean, protectionType: string, canDelete: boolean}>}
 */
export async function getBranchProtectionStatus(
  branchName: string
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

  // Check branch protection
  try {
    const protection = await github.rest.repos.getBranchProtection({owner, repo, branch: branchName})
    if (protection.data?.allow_deletions?.enabled) {
      canDelete = true
    } else {
      isProtected = true
      protectionType = 'branch protection'
      canDelete = false
    }
  } catch (err: unknown) {
    if ((err as {status?: number}).status !== 404) {
      isProtected = true
      protectionType = 'error'
      canDelete = false
    }
  }

  // Check rulesets
  try {
    const rules = await github.rest.repos.getBranchRules({owner, repo, branch: branchName})
    if (
      rules.data?.some(
        rule =>
          typeof (rule as {deletion?: boolean}).deletion !== 'undefined' &&
          (rule as {deletion?: boolean}).deletion === false
      )
    ) {
      isProtected = true
      protectionType = protectionType ? `${protectionType} and ruleset` : 'ruleset'
      canDelete = false
    }
  } catch {
    // ignore
  }

  const includeProtectedBranches = core.getInput('include-protected-branches').toLowerCase() === 'true'
  if (isProtected && includeProtectedBranches) {
    canDelete = true
  }

  return {isProtected, protectionType, canDelete}
}

/**
 * @deprecated Use getBranchProtectionStatus in the main branch loop instead.
 */
