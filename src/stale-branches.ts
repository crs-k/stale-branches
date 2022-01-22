import * as core from '@actions/core'
import {createIssue} from './functions/create-issue'
import {daysBeforeStale} from './functions/get-context'
import {getBranches} from './functions/get-branches'
import {getIssue} from './functions/get-issue'
import {getMinutes} from './functions/get-time'
import {getRecentCommitDate} from './functions/get-commits'

import {updateIssue} from './functions/update-issue'

export async function run(): Promise<void> {
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
      const existingIssue = await getIssue(branchName)
      if (commitAge > daysBeforeStale) {
        core.info(`Stale Branch: ${branchName}`)
        core.info(`Commit Age: ${commitAge.toString()}`)
        core.info(`Allowed Days: ${daysBeforeStale.toString()}`)

        if (existingIssue !== 0) {
          await updateIssue(existingIssue, branchName, commitAge)
        } else {
          await createIssue(branchName, commitAge)
        }
      }
    }
    core.endGroup()
  } catch (error) {
    if (error instanceof Error) core.setFailed(`Action failed with ${error.message}`)
  }
}
