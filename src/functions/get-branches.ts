import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'

export async function getBranches(): Promise<[string, boolean]> {
  core.info('Retrieving branch information...')
  let branchName: string
  let protectEnabled: boolean

  try {
    // Get info from the most recent release
    const response = await github.rest.repos.listBranches({
      owner,
      repo,
      protected: false,
      per_page: 100,
      page: 1
    })
    branchName = response.data[0].name
    protectEnabled = response.data[0].protected

    for (const i of response.data) {
      const branchResponse = await github.rest.repos.getBranch({
        owner,
        repo,
        branch: i.name
      })
      core.info(branchResponse.data.commit.author?.node_id || '')
    }

    assert.ok(branchName, 'name cannot be empty')
    //assert.ok(protectEnabled, 'protected cannot be empty')
  } catch (err) {
    if (err instanceof Error)
      core.setFailed(`Failed to retrieve branches for ${repo} with ${err.message}`)
    branchName = ''
    protectEnabled = false
  }
  const data: [branch: string, protectEnabled: boolean] = [branchName, protectEnabled]
  // Print the previous release info
  core.info(`Branch Name: '${branchName}'`)
  core.info(`Protected: '${protectEnabled}'`)

  return data
}
