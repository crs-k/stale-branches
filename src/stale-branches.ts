import * as core from '@actions/core'
import {closeIssue} from './functions/close-issue'
import {compareBranches} from './functions/compare-branches'
import {createIssue} from './functions/create-issue'
import {createIssueComment} from './functions/create-issue-comment'
import {createIssueTitleString} from './functions/utils/create-issues-title-string'
import {deleteBranch} from './functions/delete-branch'
import {getBranches} from './functions/get-branches'
import {getIssueBudget} from './functions/get-stale-issue-budget'
import {getIssues} from './functions/get-issues'
import {getRateLimit} from './functions/get-rate-limit'
import {getRecentCommitAge} from './functions/get-commit-age'
import {getRecentCommitLogin} from './functions/get-committer-login'
import {logActiveBranch} from './functions/logging/log-active-branch'
import {logBranchGroupColor} from './functions/logging/log-branch-group-color'
import {logLastCommitColor} from './functions/logging/log-last-commit-color'
import {logMaxIssues} from './functions/logging/log-max-issues'
import {logOrphanedIssues} from './functions/logging/log-orphaned-issues'
import {logRateLimitBreak} from './functions/logging/log-rate-limit-break'
import {logTotalAssessed} from './functions/logging/log-total-assessed'
import {logTotalDeleted} from './functions/logging/log-total-deleted'
import {validateInputs} from './functions/get-context'
import {filterBranches} from './functions/utils/filter-branches'
import {getPr} from './functions/get-pr'

export async function run(): Promise<void> {
  //Declare output arrays
  const outputDeletes: string[] = []
  const outputStales: string[] = []

  try {
    //Validate & Return input values
    const validInputs = await validateInputs()
    if (validInputs.daysBeforeStale == null) {
      throw new Error('Invalid inputs')
    }
    //Collect Branches, Issue Budget, Existing Issues, & initialize lastCommitLogin
    const unfilteredBranches = await getBranches()
    const branches = await filterBranches(unfilteredBranches, validInputs.branchesFilterRegex)
    const outputTotal = branches.length
    let existingIssue = await getIssues(validInputs.staleBranchLabel)
    let issueBudgetRemaining = await getIssueBudget(validInputs.maxIssues, validInputs.staleBranchLabel)
    let lastCommitLogin = 'Unknown'

    // Assess Branches
    for (const branchToCheck of branches) {
      // Break if Rate Limit usage exceeds 95%
      if (validInputs.rateLimit) {
        const rateLimit = await getRateLimit()
        if (rateLimit.used > 95) {
          core.info(logRateLimitBreak(rateLimit))
          core.setFailed('Exiting to avoid rate limit violation.')
          break
        }
      }

      // Check for active pull requests if prCheck is true
      if (validInputs.prCheck) {
        const activePrs = await getPr(branchToCheck.branchName)
        if (activePrs > 0) {
          core.info(`Skipping ${branchToCheck.branchName} due to active pull request(s).`)
          continue
        }
      }

      //Get age of last commit, generate issue title, and filter existing issues to current branch
      const commitAge = await getRecentCommitAge(branchToCheck.commmitSha)
      const issueTitleString = createIssueTitleString(branchToCheck.branchName)
      const filteredIssue = existingIssue.filter(branchIssue => branchIssue.issueTitle === issueTitleString)

      // Skip looking for last commit's login if input is set to false
      if (validInputs.tagLastCommitter === true) {
        lastCommitLogin = await getRecentCommitLogin(branchToCheck.commmitSha)
      }

      // Start output group for current branch assessment
      core.startGroup(logBranchGroupColor(branchToCheck.branchName, commitAge, validInputs.daysBeforeStale, validInputs.daysBeforeDelete))

      //Compare current branch to default branch
      const branchComparison = await compareBranches(branchToCheck.branchName, validInputs.compareBranches)

      //Log last commit age
      core.info(logLastCommitColor(commitAge, validInputs.daysBeforeStale, validInputs.daysBeforeDelete))

      //Create new issue if branch is stale & existing issue is not found & issue budget is >0
      if (commitAge > validInputs.daysBeforeStale) {
        if (!filteredIssue.find(findIssue => findIssue.issueTitle === issueTitleString) && issueBudgetRemaining > 0) {
          await createIssue(branchToCheck.branchName, commitAge, lastCommitLogin, validInputs.daysBeforeDelete, validInputs.staleBranchLabel, validInputs.tagLastCommitter)
          issueBudgetRemaining--
          core.info(logMaxIssues(issueBudgetRemaining))
          if (!outputStales.includes(branchToCheck.branchName)) {
            outputStales.push(branchToCheck.branchName)
          }
        }
      }

      //Close issues if a branch becomes active again
      if (commitAge < validInputs.daysBeforeStale) {
        for (const issueToClose of filteredIssue) {
          if (issueToClose.issueTitle === issueTitleString) {
            core.info(logActiveBranch(branchToCheck.branchName))
            await closeIssue(issueToClose.issueNumber)
          }
        }
      }

      //Update existing issues
      if (commitAge > validInputs.daysBeforeStale) {
        for (const issueToUpdate of filteredIssue) {
          if (issueToUpdate.issueTitle === issueTitleString) {
            await createIssueComment(
              issueToUpdate.issueNumber,
              branchToCheck.branchName,
              commitAge,
              lastCommitLogin,
              validInputs.commentUpdates,
              validInputs.daysBeforeDelete,
              validInputs.staleBranchLabel,
              validInputs.tagLastCommitter
            )
            if (!outputStales.includes(branchToCheck.branchName)) {
              outputStales.push(branchToCheck.branchName)
            }
          }
        }
      }

      //Delete expired branches
      if (commitAge > validInputs.daysBeforeDelete && branchComparison.save === false) {
        for (const issueToDelete of filteredIssue) {
          if (issueToDelete.issueTitle === issueTitleString) {
            await deleteBranch(branchToCheck.branchName)
            await closeIssue(issueToDelete.issueNumber)
            outputDeletes.push(branchToCheck.branchName)
          }
        }
      }

      // Remove filteredIssue from existingIssue
      existingIssue = existingIssue.filter(branchIssue => branchIssue.issueTitle !== issueTitleString)

      // Close output group for current branch assessment
      core.endGroup()
    }
    // Close orphaned Issues
    if (existingIssue.length > 0) {
      core.startGroup(logOrphanedIssues(existingIssue.length))
      for (const issueToDelete of existingIssue) {
        // Break if Rate Limit usage exceeds 95%
        if (validInputs.rateLimit) {
          const rateLimit = await getRateLimit()
          if (rateLimit.used > 95) {
            core.info(logRateLimitBreak(rateLimit))
            core.setFailed('Exiting to avoid rate limit violation.')
            break
          }
        }
        await closeIssue(issueToDelete.issueNumber)
      }
      core.endGroup()
    }

    core.setOutput('stale-branches', JSON.stringify(outputStales))
    core.setOutput('deleted-branches', JSON.stringify(outputDeletes))
    core.info(logTotalAssessed(outputStales.length, outputTotal))
    core.info(logTotalDeleted(outputDeletes.length, outputStales.length))
  } catch (error) {
    if (error instanceof Error) core.setFailed(`Action failed. Error: ${error.message}`)
  }
}
