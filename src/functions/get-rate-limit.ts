import * as assert from 'assert'
import * as core from '@actions/core'
// eslint-disable-next-line import/named
import {GetResponseTypeFromEndpointMethod} from '@octokit/types'
import {RateLimit} from '../types/rate-limit'
import {getMinutes} from './utils/get-time'
import {github} from './get-context'

type ListIssuesResponseDataType = GetResponseTypeFromEndpointMethod<typeof github.rest.rateLimit.get>

/**
 * Returns data on current rate limit usage for this repository
 *
 * @return {RateLimit} data related to current rate limit usage
 */
export async function getRateLimit(): Promise<RateLimit> {
  let rateLimit = {} as unknown as ListIssuesResponseDataType
  const rateLimitResponse = {} as unknown as RateLimit
  try {
    rateLimit = await github.rest.rateLimit.get()

    const rateLimitUsed = Math.round((rateLimit.data.resources.core.used / rateLimit.data.resources.core.limit) * 100)
    const rateLimitRemaining = Math.round((rateLimit.data.resources.core.remaining / rateLimit.data.resources.core.limit) * 100)
    const currentDate = new Date().getTime()
    const rateLimitReset = new Date(rateLimit.data.resources.core.reset * 1000).getTime()
    const rateLimitResetMinutes = getMinutes(currentDate, rateLimitReset)

    rateLimitResponse.used = rateLimitUsed
    rateLimitResponse.remaining = rateLimitRemaining
    rateLimitResponse.reset = rateLimitResetMinutes
    rateLimitResponse.resetDateTime = new Date(rateLimitReset)

    assert.ok(rateLimitResponse, 'Rate Limit Response cannot be empty.')
  } catch (err) {
    if (err instanceof Error) {
      core.info(`Failed to retrieve rate limit data. Error: ${err.message}`)
    } else {
      core.info(`Failed to retrieve rate limit data.`)
    }
  }

  return rateLimitResponse
}
