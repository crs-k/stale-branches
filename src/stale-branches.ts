import * as core from '@actions/core'
import {daysBeforeDelete, daysBeforeStale} from './functions/get-context'
import {closeIssue} from './functions/close-issue'
import {createIssue} from './functions/create-issue'
import {deleteBranch} from './functions/delete-branch'
import {getBranches} from './functions/get-branches'
import {getDays} from './functions/get-time'
import {getIssueBudget} from './functions/get-stale-issue-budget'
import {getIssues} from './functions/get-issues'
import {getRecentCommitDate} from './functions/get-commits'
import {updateIssue} from './functions/update-issue'

export async function run(): Promise<void> {
  const outputDeletes: string[] = []
  const outputStales: string[] = []
  try {
    //Collect Branches
    const branches = await getBranches()
    // Assess Branches
    core.startGroup('Identified Branches')
    for (const branchToCheck of branches.data) {
      const commitDateResponse = await getRecentCommitDate(branchToCheck.commit.sha)
      const currentDate = new Date().getTime()
      const commitDate = new Date(commitDateResponse).getTime()
      const commitAge = getDays(currentDate, commitDate)
      const branchName = branchToCheck.name
      const issueBudgetRemaining = await getIssueBudget()

      //Create & Update issues for stale branches
      if (commitAge > daysBeforeStale) {
        core.info(`Stale Branch: ${branchName}`)
        core.info(` Last Commit: ${commitAge.toString()} days ago.`)
        core.info(` Stale Branch Threshold: ${daysBeforeStale.toString()} days.`)
        const existingIssue = await getIssues()
        //Create new issue if existing issue is not found
        if (
          !existingIssue.data.find(findIssue => findIssue.title === `[${branchName}] is STALE`) &&
          issueBudgetRemaining > 0
        ) {
          await createIssue(branchName, commitAge)
          core.info(` New issue created: [${branchName}] is STALE`)
          outputStales.push(branchName)
        }
        //filter out issues that do not match this Action's title convention
        const filteredIssue = existingIssue.data.filter(
          branchIssue => branchIssue.title === `[${branchName}] is STALE`
        )
        for (const issueToUpdate of filteredIssue) {
          if (issueToUpdate.title === `[${branchName}] is STALE`) {
            await updateIssue(issueToUpdate.number, branchName, commitAge)
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
            core.info(`Active Branch: ${branchName}`)
            core.info(` Last Commit: ${commitAge.toString()} days ago.`)
            core.info(` Stale Branch Threshold: ${daysBeforeStale.toString()}`)
            await closeIssue(issueToClose.number)
          }
        }
      }

      //Delete expired branches
      if (commitAge > daysBeforeDelete) {
        core.info(`Dead Branch: ${branchName}`)
        core.info(` Last Commit: ${commitAge.toString()} days ago.`)
        core.info(` Delete Branch Threshold: ${daysBeforeDelete.toString()}`)
        const existingIssue = await getIssues()
        const filteredIssue = existingIssue.data.filter(
          branchIssue => branchIssue.title === `[${branchName}] is STALE`
        )
        for (const n of filteredIssue) {
          if (n.title === `[${branchName}] is STALE`) {
            await closeIssue(n.number)
            await deleteBranch(branchName)
            outputDeletes.push(branchName)
          }
        }
      }
    }
    core.notice(`Stale Branches:  ${JSON.stringify(outputStales)}`)
    core.notice(`Deleted Branches:  ${JSON.stringify(outputDeletes)}`)
    core.setOutput('stale-branches', JSON.stringify(outputStales))
    core.setOutput('closed-branches', JSON.stringify(outputDeletes))
  } catch (error) {
    if (error instanceof Error) core.setFailed(`Action failed with ${error.message}`)
  }
}
