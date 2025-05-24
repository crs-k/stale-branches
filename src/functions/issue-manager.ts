import * as core from '@actions/core'
import {Inputs} from '../types/inputs'
import {IssueResponse} from '../types/issues'
import {createIssue} from './create-issue'
import {createIssueComment} from './create-issue-comment'
import {closeIssue} from './close-issue'
import {logActiveBranch} from './logging/log-active-branch'
import {logMaxIssues} from './logging/log-max-issues'

export interface IssueProcessingResult {
  issueBudgetRemaining: number
  staleAdded: boolean
}

/**
 * Handles closing an issue with proper logging and dry-run support
 */
export async function closeIssueWithLogging(issueNumber: number, validInputs: Inputs, branchName: string): Promise<string> {
  if (!validInputs.ignoreIssueInteraction && !validInputs.dryRun) {
    return await closeIssue(issueNumber)
  } else if (validInputs.dryRun) {
    core.info(`Dry Run: Issue would be closed for branch: ${branchName}`)
  } else if (validInputs.ignoreIssueInteraction) {
    core.info(`Ignoring issue interaction: Issue would be closed for branch: ${branchName}`)
  }
  return ''
}

/**
 * Creates a new issue for a stale branch
 */
export async function createStaleIssue(branchName: string, commitAge: number, lastCommitLogin: string, validInputs: Inputs, issueBudgetRemaining: number): Promise<IssueProcessingResult> {
  if (issueBudgetRemaining <= 0) {
    return {issueBudgetRemaining, staleAdded: false}
  }

  if (!validInputs.dryRun && !validInputs.ignoreIssueInteraction) {
    await createIssue(branchName, commitAge, lastCommitLogin, validInputs.daysBeforeDelete, validInputs.staleBranchLabel, validInputs.tagLastCommitter)
  } else if (validInputs.dryRun) {
    core.info(`Dry Run: Issue would be created for branch: ${branchName}`)
  } else if (validInputs.ignoreIssueInteraction) {
    core.info(`Ignoring issue interaction: Issue would be created for branch: ${branchName}`)
  }

  const newBudget = issueBudgetRemaining - 1
  core.info(logMaxIssues(newBudget))

  return {issueBudgetRemaining: newBudget, staleAdded: true}
}

/**
 * Updates an existing issue for a stale branch
 */
export async function updateStaleIssue(issueNumber: number, branchName: string, commitAge: number, lastCommitLogin: string, validInputs: Inputs): Promise<void> {
  if (!validInputs.dryRun && !validInputs.ignoreIssueInteraction) {
    await createIssueComment(issueNumber, branchName, commitAge, lastCommitLogin, validInputs.commentUpdates, validInputs.daysBeforeDelete, validInputs.staleBranchLabel, validInputs.tagLastCommitter)
  } else if (validInputs.dryRun) {
    core.info(`Dry Run: Issue would be updated for branch: ${branchName}`)
  } else if (validInputs.ignoreIssueInteraction) {
    core.info(`Ignoring issue interaction: Issue would be updated for branch: ${branchName}`)
  }
}

/**
 * Processes issues for branches that have become active again
 */
export async function processActiveBranchIssues(branchName: string, issueTitleString: string, filteredIssues: IssueResponse[], validInputs: Inputs): Promise<void> {
  for (const issueToClose of filteredIssues) {
    if (issueToClose.issueTitle === issueTitleString) {
      core.info(logActiveBranch(branchName))
      await closeIssueWithLogging(issueToClose.issueNumber, validInputs, branchName)
    }
  }
}

/**
 * Processes issues for stale branches (create new or update existing)
 */
export async function processStaleBranchIssues(
  branchName: string,
  issueTitleString: string,
  commitAge: number,
  lastCommitLogin: string,
  filteredIssues: IssueResponse[],
  validInputs: Inputs,
  issueBudgetRemaining: number
): Promise<IssueProcessingResult> {
  // Check if issue already exists
  const existingIssue = filteredIssues.find(issue => issue.issueTitle === issueTitleString)

  if (!existingIssue) {
    // Create new issue
    return await createStaleIssue(branchName, commitAge, lastCommitLogin, validInputs, issueBudgetRemaining)
  } else {
    // Update existing issue
    await updateStaleIssue(existingIssue.issueNumber, branchName, commitAge, lastCommitLogin, validInputs)
    return {issueBudgetRemaining, staleAdded: true}
  }
}
