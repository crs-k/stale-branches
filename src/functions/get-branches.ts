import * as assert from 'assert'
import * as core from '@actions/core'
import {github, owner, repo} from './get-context'
// eslint-disable-next-line import/named
import {GetResponseTypeFromEndpointMethod} from '@octokit/types'

type ListBranchesResponseDataType = GetResponseTypeFromEndpointMethod<
  typeof github.rest.repos.listBranches
>

export async function getBranches(): Promise<ListBranchesResponseDataType['data']> {
  let branches: ListBranchesResponseDataType['data']
  try {
    const response = await github.paginate(github.rest.repos.listBranches, {
      owner,
      repo,
      protected: false,
      per_page: 100
    })

    branches = response

    core.info(`${branches.length} branches found.`)
    assert.ok(branches, 'Response cannot be empty.')
  } catch (err) {
    if (err instanceof Error) {
      core.setFailed(`Failed to retrieve branches for ${repo}. Error: ${err.message}`)
    }
    core.setFailed(`Failed to retrieve branches for ${repo}.`)
    branches = {} as ListBranchesResponseDataType['data']
  }

  return branches
}
