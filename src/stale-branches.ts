import * as core from '@actions/core'
import {getBranches} from './functions/get-branches'

export async function run(): Promise<void> {
  try {
    //Collect Branches
    const {0: branchName, 1: protectEnabled} = await getBranches()

    // Mark branches
    if (protectEnabled === true) {
      core.info(`Branch Name: '${branchName}'`)
      core.info(`Protected: '${protectEnabled}'`)
    } else {
      core.info(`No qualifying unprotected branches.`)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(`Action failed with ${error.message}`)
  }
}
