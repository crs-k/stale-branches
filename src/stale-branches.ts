import * as core from '@actions/core'
import {daysBeforeDelete, daysBeforeStale} from './functions/get-context'
import {closeIssue} from './functions/close-issue'
import {createIssue} from './functions/create-issue'
import {deleteBranch} from './functions/delete-branch'
import {getBranches} from './functions/get-branches'
import {getDays} from './functions/get-time'
import {getIssueBudget} from './functions/get-stale-issue-budget'
import {getIssues} from './functions/get-issues'
import {getRecentCommitDate} from './functions/get-commit-date'
import {getRecentCommitLogin} from './functions/get-committer-login'
import styles from 'ansi-styles'
import {updateIssue} from './functions/update-issue'

export async function run(): Promise<void> {
  const outputDeletes: string[] = []
  const outputStales: string[] = []
  try {
    //Collect Branches & budget
    const branches = await getBranches()
    let issueBudgetRemaining = await getIssueBudget()

    // Assess Branches
    for (const branchToCheck of branches) {
      if (issueBudgetRemaining < 1) break
      const lastCommitDate = await getRecentCommitDate(branchToCheck.commmitSha)
      const lastCommitLogin = await getRecentCommitLogin(branchToCheck.commmitSha)
      const currentDate = new Date().getTime()
      const commitDate = new Date(lastCommitDate).getTime()
      const commitAge = getDays(currentDate, commitDate)
      const branchName = branchToCheck.branchName
      core.startGroup(`[${styles.blue.open}${branchName}${styles.blue.close}]`)
      core.info(
        `[${styles.blue.open}${branchName}${styles.blue.close}] - Last Commit: ${
          styles.magenta.open
        }${commitAge.toString()}${styles.magenta.close} days ago.`
      )
      //Create & Update issues for stale branches
      if (commitAge > daysBeforeStale) {
        const existingIssue = await getIssues()

        //Create new issue if existing issue is not found
        if (
          !existingIssue.data.find(findIssue => findIssue.title === `[${branchName}] is STALE`) &&
          issueBudgetRemaining > 0
        ) {
          await createIssue(branchName, commitAge, lastCommitLogin)
          issueBudgetRemaining--
          core.info(`New issue created: [${branchName}] is STALE`)
          core.info(`Issue Budget Remaining: ${issueBudgetRemaining}`)
          outputStales.push(branchName)
        }

        //filter out issues that do not match this Action's title convention
        const filteredIssue = existingIssue.data.filter(
          branchIssue => branchIssue.title === `[${branchName}] is STALE`
        )
        //Update existing issues
        for (const issueToUpdate of filteredIssue) {
          if (issueToUpdate.title === `[${branchName}] is STALE`) {
            await updateIssue(issueToUpdate.number, branchName, commitAge, lastCommitLogin)
            outputStales.push(branchName)
          }
        }
      }

      //Close issues if a branch becomes active again
      if (commitAge < daysBeforeStale) {
        const existingIssue = await getIssues()
        const filteredIssue = existingIssue.data.filter(
          branchIssue => branchIssue.title === `[${branchName}] is STALE`
        )
        for (const issueToClose of filteredIssue) {
          if (issueToClose.title === `[${branchName}] is STALE`) {
            core.info(`${branchName} has become active again.`)
            core.info(` Closing Issue #${issueToClose.number}`)
            await closeIssue(issueToClose.number)
          }
        }
      }

      //Delete expired branches
      if (commitAge > daysBeforeDelete) {
        const existingIssue = await getIssues()
        const filteredIssue = existingIssue.data.filter(
          branchIssue => branchIssue.title === `[${branchName}] is STALE`
        )
        for (const issueToDelete of filteredIssue) {
          if (issueToDelete.title === `[${branchName}] is STALE`) {
            await deleteBranch(branchName)
            await closeIssue(issueToDelete.number)
            outputDeletes.push(branchName)
          }
        }
      }
      core.endGroup()
    }
    core.notice(`Stale Branches:  ${JSON.stringify(outputStales)}`)
    core.notice(`Deleted Branches:  ${JSON.stringify(outputDeletes)}`)
    core.setOutput('stale-branches', JSON.stringify(outputStales))
    core.setOutput('deleted-branches', JSON.stringify(outputDeletes))
  } catch (error) {
    if (error instanceof Error) core.setFailed(`Action failed. Error: ${error.message}`)
  }
}
