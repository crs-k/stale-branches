import {getRulesetProtectionStatus} from '../../src/functions/get-ruleset-protection'
import {github} from '../../src/functions/get-context'
import * as core from '@actions/core'

jest.mock('../../src/functions/get-context', () => ({
  github: {
    rest: {
      repos: {
        get: jest.fn(),
        getBranchProtection: jest.fn(),
        getBranchRules: jest.fn()
      }
    }
  },
  owner: 'owner',
  repo: 'repo'
}))


describe('getRulesetProtectionStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns protected for ruleset when deletion is false', async () => {
    jest.spyOn(github.rest.repos, 'getBranchRules').mockResolvedValueOnce({
      data: [{deletion: false}] as any,
      headers: {},
      status: 200,
      url: 'mock-url'
    })
    const result = await getRulesetProtectionStatus('feature')
    expect(result.hasRulesetProtection).toBe(true)
    expect(result.canDelete).toBe(false)
    expect(result.hasPermissionIssues).toBe(false)
  })

  it('returns unprotected when no rulesets exist (404)', async () => {
    jest.spyOn(github.rest.repos, 'getBranchRules').mockImplementationOnce(() => {
      throw {status: 404}
    })
    
    const result = await getRulesetProtectionStatus('feature')
    expect(result.hasRulesetProtection).toBe(false)
    expect(result.canDelete).toBe(true)
    expect(result.hasPermissionIssues).toBe(false)
  })

  it('handles ruleset API errors gracefully', async () => {
        const warningSpy = jest.spyOn(core, 'warning').mockImplementation()
    jest.spyOn(github.rest.repos, 'getBranchRules').mockImplementationOnce(() => {
      throw {status: 500, message: 'Internal server error'}
    })
    const result = await getRulesetProtectionStatus('feature')
    expect(result.hasRulesetProtection).toBe(false)
    expect(result.canDelete).toBe(true)
    expect(result.hasPermissionIssues).toBe(false)
    expect(warningSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to check rulesets for feature'))
    
    warningSpy.mockRestore()
  })

  it('handles ruleset 403 permission errors gracefully', async () => {
        const warningSpy = jest.spyOn(core, 'warning').mockImplementation()
    jest.spyOn(github.rest.repos, 'getBranchRules').mockImplementationOnce(() => {
      throw {status: 403, message: 'Forbidden'}
    })
    
    const result = await getRulesetProtectionStatus('feature')
    expect(result.hasRulesetProtection).toBe(false)
    expect(result.canDelete).toBe(true)
    expect(result.hasPermissionIssues).toBe(true)
    expect(warningSpy).toHaveBeenCalledWith(expect.stringContaining('GitHub token lacks permission to read repository rulesets'))
    warningSpy.mockRestore()
  })

  it('returns unprotected when rulesets allow deletion', async () => {
    jest.spyOn(github.rest.repos, 'getBranchRules').mockResolvedValueOnce({
      data: [{deletion: true}] as any,
      headers: {},
      status: 200,
      url: 'mock-url'
    })
    const result = await getRulesetProtectionStatus('feature')
    expect(result.hasRulesetProtection).toBe(false)
    expect(result.canDelete).toBe(true)
    expect(result.hasPermissionIssues).toBe(false)
  })

  it('returns unprotected when no rulesets are returned', async () => {
    jest.spyOn(github.rest.repos, 'getBranchRules').mockResolvedValueOnce({
      data: [] as any,
      headers: {},
      status: 200,
      url: 'mock-url'
    })
    const result = await getRulesetProtectionStatus('feature')
    expect(result.hasRulesetProtection).toBe(false)
    expect(result.canDelete).toBe(true)
    expect(result.hasPermissionIssues).toBe(false)
  })
})