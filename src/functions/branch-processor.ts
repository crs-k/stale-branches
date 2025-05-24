import * as core from '@actions/core'
import {Inputs} from '../types/inputs'
import {BranchResponse} from '../types/branches'
import {IssueResponse} from '../types/issues'
import {getRateLimit} from './get-rate-limit'
import {getPr} from './get-pr'
import {getRecentCommitAge, getRecentCommitAgeByNonIgnoredMessage} from './get-commit-age'
import {getRecentCommitLogin} from './get-committer-login'
import {createIssueTitleString} from './utils/create-issues-title-string'
import {compareBranches} from './compare-branches'
import {logBranchGroupColor} from './logging/log-branch-group-color'
import {logBranchGroupColorSkip} from './logging/log-branch-group-color-skip'
import {logLastCommitColor} from './logging/log-last-commit-color'
import {logSkippedBranch} from './logging/log-skipped-branch'
import {logRateLimitBreak} from './logging/log-rate-limit-break'

export interface BranchProcessingResult {
  shouldSkip: boolean
  reason?: string
  activePrs?: number
}

export interface BranchProcessingContext {
  validInputs: Inputs
  existingIssues: IssueResponse[]
  issueBudgetRemaining: number
  outputStales: string[]
  outputDeletes: string[]
}

/**
 * Checks if a branch should be skipped due to rate limiting
 */
export async function checkRateLimit(validInputs: Inputs): Promise<boolean> {
  if (!validInputs.rateLimit) {
    return false
  }

  const rateLimit = await getRateLimit()
  if (rateLimit.used > 95) {
    core.info(logRateLimitBreak(rateLimit))
    core.setFailed('Exiting to avoid rate limit violation.')
    return true
  }

  return false
}

/**
 * Checks if a branch should be skipped due to active pull requests
 */
export async function checkActivePullRequests(branchName: string, validInputs: Inputs): Promise<BranchProcessingResult> {
  if (!validInputs.prCheck) {
    return {shouldSkip: false}
  }

  const activePrs = await getPr(branchName)
  if (activePrs > 0) {
    core.startGroup(logBranchGroupColorSkip(branchName))
    core.info(logSkippedBranch(branchName, activePrs))
    core.endGroup()
    return {
      shouldSkip: true,
      reason: 'Active pull requests',
      activePrs
    }
  }

  return {shouldSkip: false}
}

/**
 * Gets the commit age for a branch, handling ignored commit messages
 */
export async function getBranchCommitAge(commitSha: string, validInputs: Inputs): Promise<number> {
  if (validInputs.ignoreCommitMessages && validInputs.ignoreCommitMessages.trim() !== '') {
    const ignoredMessages = validInputs.ignoreCommitMessages
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
    return await getRecentCommitAgeByNonIgnoredMessage(commitSha, ignoredMessages, validInputs.daysBeforeDelete)
  }

  return await getRecentCommitAge(commitSha)
}

/**
 * Gets the last committer login if tagging is enabled
 */
export async function getLastCommitterLogin(commitSha: string, validInputs: Inputs): Promise<string> {
  if (!validInputs.tagLastCommitter) {
    return 'Unknown'
  }

  return await getRecentCommitLogin(commitSha)
}

/**
 * Processes branch metadata and prepares for branch assessment
 */
export async function prepareBranchAssessment(
  branch: BranchResponse,
  validInputs: Inputs
): Promise<{
  commitAge: number
  issueTitleString: string
  lastCommitLogin: string
  branchComparison: any
}> {
  // Get commit age
  const commitAge = await getBranchCommitAge(branch.commmitSha, validInputs)

  // Generate issue title
  const issueTitleString = createIssueTitleString(branch.branchName)

  // Get last committer
  const lastCommitLogin = await getLastCommitterLogin(branch.commmitSha, validInputs)

  // Compare branches
  const branchComparison = await compareBranches(branch.branchName, validInputs.compareBranches)

  // Start output group and log commit age
  core.startGroup(logBranchGroupColor(branch.branchName, commitAge, validInputs.daysBeforeStale, validInputs.daysBeforeDelete))
  core.info(logLastCommitColor(commitAge, validInputs.daysBeforeStale, validInputs.daysBeforeDelete))

  return {
    commitAge,
    issueTitleString,
    lastCommitLogin,
    branchComparison
  }
}
