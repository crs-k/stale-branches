import * as core from '@actions/core'
import {context, getOctokit} from '@actions/github'
import {InputCompareBranches} from '../enums/input-compare-branches'
import {Inputs} from '../types/inputs'

const repoToken = core.getInput('repo-token')
core.setSecret(repoToken)
export const github = getOctokit(repoToken)
export const {owner: owner, repo: repo} = context.repo

export async function validateInputs(): Promise<Inputs> {
  const result = {} as unknown as Inputs
  try {
    //Validate and assign days-before-stale & days-before-delete
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
    result.daysBeforeStale = inputDaysBeforeStale
    result.daysBeforeDelete = inputDaysBeforeDelete

    //Validate and assign comment-updates
    const inputCommentUpdates = core.getBooleanInput('comment-updates')
    result.commentUpdates = inputCommentUpdates

    //Validate and assign max-issues
    const inputMaxIssues = Number(core.getInput('max-issues'))

    if (inputMaxIssues.toString() === 'NaN') {
      throw new Error('max-issues must be a number')
    }

    if (inputMaxIssues < 0) {
      throw new Error('max-issues must be greater than zero')
    }

    result.maxIssues = inputMaxIssues

    //Validate and assign tag-committer
    const inputTagLastCommitter = core.getBooleanInput('tag-committer')
    result.tagLastCommitter = inputTagLastCommitter

    //Validate and assign stale-branch-label
    const inputStaleBranchLabel = String(core.getInput('stale-branch-label'))
    if (inputStaleBranchLabel.length > 50) {
      throw new Error('stale-branch-label must be 50 characters or less')
    }
    result.staleBranchLabel = inputStaleBranchLabel

    //Validate and assign compare-branches
    const inputCompareBranches = core.getInput('compare-branches')
    if (!(inputCompareBranches in InputCompareBranches)) {
      throw new Error(`compare-branches input of '${inputCompareBranches}' is not valid.`)
    }
    result.compareBranches = inputCompareBranches
  } catch (err: unknown) {
    if (err instanceof Error) {
      core.error(`Failed to validate inputs. Error: ${err.message}`)
      core.setFailed(`Failed to validate inputs. Error: ${err.message}`)
    } else {
      core.error(`Failed to validate inputs.`)
      core.setFailed(`Failed to validate inputs.`)
    }
  }
  return result
}
