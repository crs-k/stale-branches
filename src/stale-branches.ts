import * as core from '@actions/core'
import {closeIssue} from './functions/close-issue'
import {compareBranches} from './functions/compare-branches'
import {createIssue} from './functions/create-issue'
import {createIssueTitle} from './utils/create-issues-title'
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
import {logRateLimitBreak} from './functions/logging/log-rate-limit-break'
import {logTotalAssessed} from './functions/logging/log-total-assessed'
import {logTotalDeleted} from './functions/logging/log-total-deleted'
import {updateIssue} from './functions/update-issue'
import {validateInputs} from './functions/get-context'

export async function run(): Promise<void> {
  //Validate & Return input values
  const validInputs = await validateInputs()

  //Declare output arrays
  const outputDeletes: string[] = []
  const outputStales: string[] = []

  try {
    //Collect Branches, Issue Budget, Existing Issues, & initialize lastCommitLogin
    const branches = await getBranches()
    const outputTotal = branches.length
    const existingIssue = await getIssues(validInputs.staleBranchLabel)
    let issueBudgetRemaining = await getIssueBudget(validInputs.maxIssues, validInputs.staleBranchLabel)
    let lastCommitLogin = 'Unknown'

    // Assess Branches
    for (const branchToCheck of branches) {
      // Break if Rate Limit usage exceeds 95%
      const rateLimit = await getRateLimit()
      if (rateLimit.used > 95) {
        core.info(logRateLimitBreak(rateLimit))
        core.setFailed('Exiting to avoid rate limit violation.')
        break
      }

      //Get age of last commit, generate issue title, and filter existing issues to current branch
      const commitAge = await getRecentCommitAge(branchToCheck.commmitSha)
      const issueTitleString = createIssueTitle(branchToCheck.branchName)
      const filteredIssue = existingIssue.filter(branchIssue => branchIssue.issueTitle === issueTitleString)

      // Skip looking for last commit's login if input is set to false
      if (validInputs.tagLastCommitter === true) {
        lastCommitLogin = await getRecentCommitLogin(branchToCheck.commmitSha)
      }

      // Start output group for current branch assessment
      core.startGroup(logBranchGroupColor(branchToCheck.branchName, commitAge, validInputs.daysBeforeStale, validInputs.daysBeforeDelete))
      //compare branches test
      await compareBranches(branchToCheck.branchName, validInputs.compareBranches)
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
            await updateIssue(
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
      if (commitAge > validInputs.daysBeforeDelete) {
        for (const issueToDelete of filteredIssue) {
          if (issueToDelete.issueTitle === issueTitleString) {
            await deleteBranch(branchToCheck.branchName)
            await closeIssue(issueToDelete.issueNumber)
            outputDeletes.push(branchToCheck.branchName)
          }
        }
      }
      // Close output group for current branch assessment
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
