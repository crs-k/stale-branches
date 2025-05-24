import * as core from '@actions/core'
import {context, getOctokit} from '@actions/github'
import {CompareBranchesEnum} from '../enums/input-compare-branches'
import {Inputs} from '../types/inputs'

const repoToken = core.getInput('repo-token')
core.setSecret(repoToken)
export const github = getOctokit(repoToken)
export const {owner: owner, repo: repo} = context.repo

/**
 * Validates the Action's inputs and assigns them to the Inputs type
 *
 * @returns {Inputs} Valid inputs @see {@link Inputs}
 */
export async function validateInputs(): Promise<Inputs> {
  const result = {} as unknown as Inputs
  try {
    //Validate days-before-stale & days-before-delete
    const inputDaysBeforeStale = Number(core.getInput('days-before-stale'))
    const inputDaysBeforeDelete = Number(core.getInput('days-before-delete'))

    if (inputDaysBeforeStale >= inputDaysBeforeDelete) {
      throw new Error('days-before-stale cannot be greater than or equal to days-before-delete')
    }

    if (inputDaysBeforeStale.toString() === 'NaN') {
      throw new Error('days-before-stale must be a number')
    }

    if (inputDaysBeforeDelete.toString() === 'NaN') {
      throw new Error('days-before-delete must be a number')
    }

    if (inputDaysBeforeStale < 0) {
      throw new Error('days-before-stale must be greater than zero')
    }

    //Validate comment-updates
    const inputCommentUpdates = core.getBooleanInput('comment-updates')

    //Validate max-issues
    const inputMaxIssues = Number(core.getInput('max-issues'))

    if (inputMaxIssues.toString() === 'NaN') {
      throw new Error('max-issues must be a number')
    }

    if (inputMaxIssues < 0) {
      throw new Error('max-issues must be greater than zero')
    }

    //Validate tag-committer
    const inputTagLastCommitter = core.getBooleanInput('tag-committer')

    //Validate stale-branch-label
    const inputStaleBranchLabel = String(core.getInput('stale-branch-label'))
    if (inputStaleBranchLabel.length > 50) {
      throw new Error('stale-branch-label must be 50 characters or less')
    }

    //Validate compare-branches
    const inputCompareBranches = core.getInput('compare-branches')
    if (!(inputCompareBranches in CompareBranchesEnum)) {
      throw new Error(`compare-branches input of '${inputCompareBranches}' is not valid.`)
    }

    //Validate branches-filter-regex
    const branchesFilterRegex = String(core.getInput('branches-filter-regex'))
    if (branchesFilterRegex.length > 50) {
      throw new Error('branches-filter-regex must be 50 characters or less')
    }

    const inputRateLimit = core.getBooleanInput('rate-limit')
    const inputPrCheck = core.getBooleanInput('pr-check')
    const dryRun = core.getBooleanInput('dry-run')
    const ignoreIssueInteraction = core.getBooleanInput('ignore-issue-interaction')
    const includeProtectedBranches = core.getBooleanInput('include-protected-branches')
    const ignoreCommitMessages = core.getInput('ignore-commit-messages')
    const ignoreCommittersInput = core.getInput('ignore-committers')
    const ignoreDefaultBranchCommitsInput = core.getInput('ignore-default-branch-commits')

    //Assign inputs
    result.daysBeforeStale = inputDaysBeforeStale
    result.daysBeforeDelete = inputDaysBeforeDelete
    result.commentUpdates = inputCommentUpdates
    result.maxIssues = inputMaxIssues
    result.tagLastCommitter = inputTagLastCommitter
    result.staleBranchLabel = inputStaleBranchLabel
    result.compareBranches = inputCompareBranches
    result.branchesFilterRegex = branchesFilterRegex
    result.rateLimit = inputRateLimit
    result.prCheck = inputPrCheck
    result.dryRun = dryRun
    result.ignoreIssueInteraction = ignoreIssueInteraction
    result.includeProtectedBranches = includeProtectedBranches
    if (ignoreCommitMessages) {
      result.ignoreCommitMessages = ignoreCommitMessages
    }
    if (ignoreCommittersInput) {
      result.ignoreCommitters = ignoreCommittersInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
    }
    if (typeof ignoreDefaultBranchCommitsInput === 'string' && ignoreDefaultBranchCommitsInput !== '') {
      result.ignoreDefaultBranchCommits = ignoreDefaultBranchCommitsInput.toLowerCase() === 'true'
    } else if (ignoreCommitMessages) {
      result.ignoreDefaultBranchCommits = true
    } else {
      result.ignoreDefaultBranchCommits = false
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      core.setFailed(`Failed to validate inputs. Error: ${err.message}`)
    } else {
      core.setFailed(`Failed to validate inputs.`)
    }
  }
  return result
}
