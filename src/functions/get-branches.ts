import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'
// eslint-disable-next-line import/named
import {GetResponseTypeFromEndpointMethod} from '@octokit/types'

type ListBranchesResponseDataType = GetResponseTypeFromEndpointMethod<
  typeof github.rest.repos.listBranches
>

export async function getBranches(): Promise<ListBranchesResponseDataType> {
  core.info('Retrieving branch information...')
  let branches: ListBranchesResponseDataType

  try {
    // Get info from the most recent release
    const response = await github.rest.repos.listBranches({
      owner,
      repo,
      protected: false,
      per_page: 100,
      page: 1
    })
    branches = response

    assert.ok(response, 'name cannot be empty')
  } catch (err) {
    if (err instanceof Error)
      core.setFailed(`Failed to retrieve branches for ${repo} with ${err.message}`)
    branches = {} as ListBranchesResponseDataType
  }

  return branches
}
