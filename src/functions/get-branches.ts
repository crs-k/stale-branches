import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'
// eslint-disable-next-line import/named
import {GetResponseTypeFromEndpointMethod} from '@octokit/types'
import {
  PaginateInterface,
  PaginatingEndpoints,
} from "@octokit/plugin-paginate-rest";

type ListBranchesResponseDataType = GetResponseTypeFromEndpointMethod<
  typeof github.rest.repos.listBranches
>

export async function getBranches(): Promise<ListBranchesResponseDataType> {
  let branches = {} as ListBranchesResponseDataType

  try {
    
    const parameters = {
      owner: owner,
      repo: repo,
      per_page: 100,
    }
    
    for await (const response of github.paginate.iterator(
      github.rest.repos.listBranches,
      parameters
    )) {
      // do whatever you want with each response, break out of the loop, etc.
      branches = response
      core.info(`${branches.data.length} branches found`)
      assert.ok(response, 'Response cannot be empty.')
    }

/*     // Get info from the most recent release
    const response = await github.rest.repos.listBranches({
      owner,
      repo,
      protected: false,
      per_page: 100,
      page: 1
    })
    branches = response */

    
  } catch (err) {
    if (err instanceof Error) {
      core.setFailed(`Failed to retrieve branches for ${repo}. Error: ${err.message}`)
    }
    core.setFailed(`Failed to retrieve branches for ${repo}.`)
    branches = {} as ListBranchesResponseDataType
  }

  return branches
}
