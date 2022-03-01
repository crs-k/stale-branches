import * as assert from 'assert'
//import * as core from '@actions/core'
// eslint-disable-next-line import/named
import {GetResponseTypeFromEndpointMethod} from '@octokit/types'
import {github} from './get-context'

type ListIssuesResponseDataType = GetResponseTypeFromEndpointMethod<typeof github.rest.rateLimit.get>

export async function getRateLimit(): Promise<ListIssuesResponseDataType> {
  let rateLimit = {} as unknown as ListIssuesResponseDataType
  //try {
  const rateResponse = await github.rest.rateLimit.get()
  rateLimit = rateResponse
  assert.ok(rateLimit, 'Rate Limit cannot be empty.')
  /*   } catch (err) {
    if (err instanceof Error) {
      core.info(`Failed to retrieve rate limit data. Error: ${err.message}`)
    } else {
      core.info(`Failed to retrieve rate limit data.`)
    }
  } */

  return rateLimit
}
