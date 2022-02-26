import * as core from '@actions/core'
import {daysBeforeDelete, daysBeforeStale, tagLastCommitter} from './functions/get-context'
import {closeIssue} from './functions/close-issue'
import {createIssue} from './functions/create-issue'
import {deleteBranch} from './functions/delete-branch'
import {getBranches} from './functions/get-branches'
import {getDays} from './functions/get-time'
import {getIssueBudget} from './functions/get-stale-issue-budget'
import {getIssues} from './functions/get-issues'
import {getRecentCommitDate} from './functions/get-commit-date'
import {getRecentCommitLogin} from './functions/get-committer-login'
import {logActiveBranch} from './functions/logging/log-active-branch'
import {logBranchGroupColor} from './functions/logging/log-branch-group-color'
import {logLastCommitColor} from './functions/logging/log-last-commit-color'
import {logMaxIssues} from './functions/logging/log-max-issues'
import {logTotalAssessed} from './functions/logging/log-total-assessed'
import {logTotalDeleted} from './functions/logging/log-total-deleted'
import {updateIssue} from './functions/update-issue'

export async function run(): Promise<void> {
  const outputDeletes: string[] = []
  const outputStales: string[] = []
  try {
    //Collect Branches, Issue Budget, and Existing Issues
    const branches = await getBranches()
    const outputTotal = branches.length
    let issueBudgetRemaining = await getIssueBudget()
    const existingIssue = await getIssues()

    // Assess Branches
    for (const branchToCheck of branches) {
      const lastCommitDate = await getRecentCommitDate(branchToCheck.commmitSha)
      const currentDate = new Date().getTime()
      const commitDate = new Date(lastCommitDate).getTime()
      const commitAge = getDays(currentDate, commitDate)
      const branchName = branchToCheck.branchName
      const filteredIssue = existingIssue.filter(branchIssue => branchIssue.issueTitle === `[${branchName}] is STALE`)

      // Start output group for current branch assessment
      core.startGroup(logBranchGroupColor(branchName, commitAge, daysBeforeStale, daysBeforeDelete))
      core.info(logLastCommitColor(commitAge, daysBeforeStale, daysBeforeDelete))
      core.info(daysBeforeStale.toString())
      // Skip looking for last commit's login if input is set to false
      let lastCommitLogin = 'Unknown'
      if (tagLastCommitter === true) {
        lastCommitLogin = await getRecentCommitLogin(branchToCheck.commmitSha)
      }

      //Create new issue if branch is stale & existing issue is not found & issue budget is >0
      if (commitAge > daysBeforeStale) {
        if (!filteredIssue.find(findIssue => findIssue.issueTitle === `[${branchName}] is STALE`) && issueBudgetRemaining > 0) {
          await createIssue(branchName, commitAge, lastCommitLogin)
          issueBudgetRemaining--
          core.info(logMaxIssues(issueBudgetRemaining))
          if (outputStales.includes(branchName) === false) {
            outputStales.push(branchName)
          }
        }
      }

      //Close issues if a branch becomes active again
      if (commitAge < daysBeforeStale) {
        for (const issueToClose of filteredIssue) {
          if (issueToClose.issueTitle === `[${branchName}] is STALE`) {
            core.info(logActiveBranch(branchName))
            await closeIssue(issueToClose.issueNumber)
          }
        }
      }

      //Update existing issues
      if (commitAge > daysBeforeStale) {
        for (const issueToUpdate of filteredIssue) {
          if (issueToUpdate.issueTitle === `[${branchName}] is STALE`) {
            await updateIssue(issueToUpdate.issueNumber, branchName, commitAge, lastCommitLogin)
            if (outputStales.includes(branchName) === false) {
              outputStales.push(branchName)
            }
          }
        }
      }

      //Delete expired branches
      if (commitAge > daysBeforeDelete) {
        for (const issueToDelete of filteredIssue) {
          if (issueToDelete.issueTitle === `[${branchName}] is STALE`) {
            await deleteBranch(branchName)
            await closeIssue(issueToDelete.issueNumber)
            outputDeletes.push(branchName)
          }
        }
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
