import * as core from '@actions/core'
import {BranchResponse} from '../types/branches'
import {github, owner, repo} from './get-context'
import {RulesetResponse} from '../types/github-api'
import {RequestError} from '@octokit/request-error'

/**
 * Returns the protection status for a single branch
 * @param {string} branchName
 * @returns {Promise<{isProtected: boolean, protectionType: string, canDelete: boolean}>}
 */
export async function getBranchProtectionStatus(branchName: string): Promise<{isProtected: boolean; protectionType: string; canDelete: boolean}> {
  let defaultBranch: string
  try {
    const repoInfo = await github.rest.repos.get({owner, repo})
    defaultBranch = repoInfo.data.default_branch
  } catch (err) {
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
    if (protection.data && protection.data.allow_deletions && protection.data.allow_deletions.enabled) {
      canDelete = true
    } else {
      isProtected = true
      protectionType = 'branch protection'
      canDelete = false
    }
  } catch (err) {
    if ((err as any).status !== 404) {
      isProtected = true
      protectionType = 'error'
      canDelete = false
    }
  }

  // Check rulesets
  try {
    const rules = await github.rest.repos.getBranchRules({owner, repo, branch: branchName})
    if (rules.data && rules.data.some(rule => typeof (rule as any).deletion !== 'undefined' && (rule as any).deletion === false)) {
      isProtected = true
      protectionType = protectionType ? protectionType + ' and ruleset' : 'ruleset'
      canDelete = false
    }
  } catch (err) {
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
