import * as assert from 'assert'
import * as core from '@actions/core'
import {RateLimit} from '../types/rate-limit'
import {github} from './get-context'

export async function getRateLimit(): Promise<RateLimit> {
  let rateLimit = {} as unknown as RateLimit
  try {
    const rateResponse = await github.rest.rateLimit.get()
    rateLimit = rateResponse.data.resources.core
    assert.ok(rateLimit, 'Rate Limit cannot be empty.')
  } catch (err) {
    if (err instanceof Error) {
      core.info(`Failed to retrieve rate limit data. Error: ${err.message}`)
    } else {
      core.info(`Failed to retrieve rate limit data.`)
    }
  }

  return rateLimit
}
