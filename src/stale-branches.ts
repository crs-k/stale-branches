import * as core from '@actions/core'
import {daysBeforeDelete, daysBeforeStale} from './functions/get-context'
import {closeIssue} from './functions/close-issue'
import {createIssue} from './functions/create-issue'
import {deleteBranch} from './functions/delete-branch'
import {getBranches} from './functions/get-branches'
import {getIssues} from './functions/get-issue'
import {getMinutes} from './functions/get-time'
import {getRecentCommitDate} from './functions/get-commits'
import {updateIssue} from './functions/update-issue'

export async function run(): Promise<void> {
  const outputDeletes = new Array('Branches Deleted')
  const outputStales = ['Branches Marked Stale']
  try {
    //Collect Branches
    const branches = await getBranches()

    // Assess Branches
    core.startGroup('Stale Branches')
    for (const i of branches.data) {
      const commitResponse = await getRecentCommitDate(i.commit.sha)
      const currentDate = new Date().getTime()
      const commitDate = new Date(commitResponse).getTime()
      const commitAge = getMinutes(currentDate, commitDate)
      const branchName = i.name

      //Delete expired branches
      if (commitAge > daysBeforeDelete) {
        core.info(`Dead Branch: ${branchName}`)
        core.info(`Commit Age: ${commitAge.toString()}`)
        core.info(`Allowed Days: ${daysBeforeStale.toString()}`)
        const existingIssue = await getIssues()
        const filteredIssue = existingIssue.data.filter(
          branchIssue => branchIssue.title === `[${branchName}] is STALE`
        )
        for (const n of filteredIssue) {
          if (n.title === `[${branchName}] is STALE`) {
            await closeIssue(n.number, branchName, commitAge)
            await deleteBranch(branchName)
            outputDeletes.push(branchName)
          }
        }
      }

      //Update issues for stale branches
      if (commitAge > daysBeforeStale) {
        core.info(`Stale Branch: ${branchName}`)
        core.info(`Commit Age: ${commitAge.toString()}`)
        core.info(`Allowed Days: ${daysBeforeStale.toString()}`)
        const existingIssue = await getIssues()

        if (!existingIssue.data.find(findIssue => findIssue.title === `[${branchName}] is STALE`)) {
          await createIssue(branchName, commitAge)
          core.info(`New issue created: [${branchName}] is STALE`)
          outputStales.push(branchName)
        }

        const filteredIssue = existingIssue.data.filter(
          branchIssue => branchIssue.title === `[${branchName}] is STALE`
        )
        for (const n of filteredIssue) {
          if (n.title === `[${branchName}] is STALE`) {
            await updateIssue(n.number, branchName, commitAge)
            outputStales.push(branchName)
          }
        }
      }
    }
    core.endGroup()
  } catch (error) {
    if (error instanceof Error) core.setFailed(`Action failed with ${error.message}`)
  }
  core.setOutput('closed-branches', JSON.stringify(outputDeletes))
  core.setOutput('stale-branches', JSON.stringify(outputStales))
}
