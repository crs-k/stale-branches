import {getBranchProtectionStatus} from '../../src/functions/get-branch-protection'
import {github} from '../../src/functions/get-context'

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

const core = require('@actions/core')

describe('getBranchProtectionStatus - Branch Protection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    core.getInput = jest.fn().mockReturnValue('false')
  })

  it('returns protected for default branch', async () => {
    jest.spyOn(github.rest.repos, 'get').mockResolvedValueOnce({data: {default_branch: 'main'}} as any)
    const result = await getBranchProtectionStatus('main', false, false)
    expect(result.isProtected).toBe(true)
    expect(result.canDelete).toBe(false)
    expect(result.protectionType).toBe('default branch')
  })

  it('returns protected for branch protection when includeProtectedBranches=true', async () => {
    jest.spyOn(github.rest.repos, 'get').mockResolvedValueOnce({data: {default_branch: 'main'}} as any)
    jest.spyOn(github.rest.repos, 'getBranchProtection').mockResolvedValueOnce({data: {allow_deletions: {enabled: false}}} as any)
    const getBranchRulesSpy = jest.spyOn(github.rest.repos, 'getBranchRules')

    const result = await getBranchProtectionStatus('feature', true, false)
    expect(result.isProtected).toBe(true)
    expect(result.canDelete).toBe(true)
    expect(result.protectionType).toBe('branch protection')

    // Should not have called ruleset API since includeRulesetBranches=false
    expect(getBranchRulesSpy).not.toHaveBeenCalled()
  })

  it('returns protected for both branch protection and ruleset when both flags enabled', async () => {
    const getSpy = jest.spyOn(github.rest.repos, 'get').mockImplementation(() =>
      Promise.resolve({data: {default_branch: 'main'}} as any)
    )
    const protectionSpy = jest.spyOn(github.rest.repos, 'getBranchProtection').mockImplementation(() =>
      Promise.resolve({data: {allow_deletions: {enabled: false}}} as any)
    )
    const rulesSpy = jest.spyOn(github.rest.repos, 'getBranchRules').mockImplementation(() =>
      Promise.resolve({data: [{deletion: false}], headers: {}, status: 200, url: 'mock-url'} as any)
    )
    
    const result = await getBranchProtectionStatus('feature', true, true)
    expect(result.isProtected).toBe(true)
    expect(result.canDelete).toBe(true)
    expect(result.protectionType).toBe('branch protection and ruleset')
    
    getSpy.mockRestore()
    protectionSpy.mockRestore()
    rulesSpy.mockRestore()
  })

  it('returns canDelete=true if includeProtectedBranches is true', async () => {
    const getSpy = jest.spyOn(github.rest.repos, 'get').mockImplementation(() =>
      Promise.resolve({data: {default_branch: 'main'}} as any)
    )
    const protectionSpy = jest.spyOn(github.rest.repos, 'getBranchProtection').mockImplementation(() =>
      Promise.resolve({data: {allow_deletions: {enabled: false}}} as any)
    )
    const rulesSpy = jest.spyOn(github.rest.repos, 'getBranchRules').mockImplementation(() =>
      Promise.resolve({data: [], headers: {}, status: 200, url: 'mock-url'} as any)
    )
    
    const result = await getBranchProtectionStatus('feature', true, false)
    expect(result.isProtected).toBe(true)
    expect(result.canDelete).toBe(true)
    
    getSpy.mockRestore()
    protectionSpy.mockRestore()
    rulesSpy.mockRestore()
  })

  it('returns canDelete=true if both include flags are true', async () => {
    const getSpy = jest.spyOn(github.rest.repos, 'get').mockImplementation(() =>
      Promise.resolve({data: {default_branch: 'main'}} as any)
    )
    const protectionSpy = jest.spyOn(github.rest.repos, 'getBranchProtection').mockImplementation(() =>
      Promise.resolve({data: {allow_deletions: {enabled: false}}} as any)
    )
    const rulesSpy = jest.spyOn(github.rest.repos, 'getBranchRules').mockImplementation(() =>
      Promise.resolve({data: [{deletion: false}], headers: {}, status: 200, url: 'mock-url'} as any)
    )
    
    const result = await getBranchProtectionStatus('feature', true, true)
    expect(result.isProtected).toBe(true)
    expect(result.canDelete).toBe(true)
    expect(result.protectionType).toBe('branch protection and ruleset')
    
    getSpy.mockRestore()
    protectionSpy.mockRestore()
    rulesSpy.mockRestore()
  })

  it('returns unprotected when repo get fails', async () => {
    jest.spyOn(github.rest.repos, 'get').mockRejectedValueOnce(new Error('API Error'))
    const result = await getBranchProtectionStatus('feature', false, false)
    expect(result.isProtected).toBe(false)
    expect(result.canDelete).toBe(true)
    expect(result.protectionType).toBe('')
  })

  it('returns protected when branch protection allows deletions', async () => {
    const getSpy = jest.spyOn(github.rest.repos, 'get').mockImplementation(() => 
      Promise.resolve({data: {default_branch: 'main'}} as any)
    )
    const protectionSpy = jest.spyOn(github.rest.repos, 'getBranchProtection').mockImplementation(() =>
      Promise.resolve({data: {allow_deletions: {enabled: true}}} as any)
    )
    const rulesSpy = jest.spyOn(github.rest.repos, 'getBranchRules').mockImplementation(() =>
      Promise.resolve({data: [], headers: {}, status: 200, url: 'mock-url'} as any)
    )
    
    const result = await getBranchProtectionStatus('feature', true, true)
    expect(result.isProtected).toBe(true)
    expect(result.canDelete).toBe(true)
    expect(result.protectionType).toBe('branch protection')
    
    getSpy.mockRestore()
    protectionSpy.mockRestore()
    rulesSpy.mockRestore()
  })

  it('returns unprotected when branch protection API fails with non-404 error', async () => {
    const core = require('@actions/core')
    const warningSpy = jest.spyOn(core, 'warning').mockImplementation()
    jest.spyOn(github.rest.repos, 'get').mockResolvedValueOnce({data: {default_branch: 'main'}} as any)
    jest.spyOn(github.rest.repos, 'getBranchProtection').mockImplementationOnce(() => {
      throw {status: 500, message: 'Server Error'}
    })
    jest.spyOn(github.rest.repos, 'getBranchRules').mockResolvedValueOnce({
      data: [] as any,
      headers: {},
      status: 200,
      url: 'mock-url'
    })
    const result = await getBranchProtectionStatus('feature', true, true)
    expect(result.isProtected).toBe(false)
    expect(result.canDelete).toBe(true)
    expect(result.protectionType).toBe('')
    expect(warningSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to check branch protection for feature'))
    warningSpy.mockRestore()
  })

  it('handles rate limit errors gracefully', async () => {
    const core = require('@actions/core')
    const warningSpy = jest.spyOn(core, 'warning').mockImplementation()
    jest.spyOn(github.rest.repos, 'get').mockResolvedValueOnce({data: {default_branch: 'main'}} as any)
    jest.spyOn(github.rest.repos, 'getBranchProtection').mockImplementationOnce(() => {
      throw {status: 429, message: 'Rate limit exceeded'}
    })
    jest.spyOn(github.rest.repos, 'getBranchRules').mockResolvedValueOnce({
      data: [] as any,
      headers: {},
      status: 200,
      url: 'mock-url'
    })
    const result = await getBranchProtectionStatus('feature', true, true)
    expect(result.isProtected).toBe(false)
    expect(result.canDelete).toBe(true)
    expect(warningSpy).toHaveBeenCalledWith(expect.stringContaining('Rate limit exceeded'))
    warningSpy.mockRestore()
  })

  it('handles network errors gracefully', async () => {
    const core = require('@actions/core')
    const warningSpy = jest.spyOn(core, 'warning').mockImplementation()
    jest.spyOn(github.rest.repos, 'get').mockResolvedValueOnce({data: {default_branch: 'main'}} as any)
    jest.spyOn(github.rest.repos, 'getBranchProtection').mockImplementationOnce(() => {
      throw {status: 0, message: 'Network error'}
    })
    jest.spyOn(github.rest.repos, 'getBranchRules').mockResolvedValueOnce({
      data: [] as any,
      headers: {},
      status: 200,
      url: 'mock-url'
    })
    const result = await getBranchProtectionStatus('feature', true, true)
    expect(result.isProtected).toBe(false)
    expect(result.canDelete).toBe(true)
    warningSpy.mockRestore()
  })

  it('handles 403 permission errors gracefully', async () => {
    const core = require('@actions/core')
    const warningSpy = jest.spyOn(core, 'warning').mockImplementation()
    jest.spyOn(github.rest.repos, 'get').mockResolvedValueOnce({data: {default_branch: 'main'}} as any)
    jest.spyOn(github.rest.repos, 'getBranchProtection').mockImplementationOnce(() => {
      throw {status: 403, message: 'Forbidden'}
    })
    jest.spyOn(github.rest.repos, 'getBranchRules').mockResolvedValueOnce({data: []} as any)

    const result = await getBranchProtectionStatus('feature', true, true)
    expect(result).toEqual({isProtected: false, protectionType: 'unknown (permission denied)', canDelete: true})
    expect(warningSpy).toHaveBeenCalledWith(expect.stringContaining('GitHub token lacks permission to read branch protection'))
    warningSpy.mockRestore()
  })

  it('returns protected when actually protected despite ruleset error', async () => {
    const core = require('@actions/core')
    const warningSpy = jest.spyOn(core, 'warning').mockImplementation()
    jest.spyOn(github.rest.repos, 'get').mockResolvedValueOnce({data: {default_branch: 'main'}} as any)
    jest.spyOn(github.rest.repos, 'getBranchProtection').mockResolvedValueOnce({data: {allow_deletions: {enabled: false}}} as any)
    jest.spyOn(github.rest.repos, 'getBranchRules').mockRejectedValueOnce({status: 500, message: 'Server error'})
    const result = await getBranchProtectionStatus('feature', true, true)
    expect(result.isProtected).toBe(true)
    expect(result.canDelete).toBe(true)
    expect(result.protectionType).toBe('branch protection')
    expect(warningSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to check rulesets for feature'))
    warningSpy.mockRestore()
  })

  it('logs debug message for 404 branch protection response', async () => {
    const core = require('@actions/core')
    const debugSpy = jest.spyOn(core, 'debug').mockImplementation()
    jest.spyOn(github.rest.repos, 'get').mockResolvedValueOnce({data: {default_branch: 'main'}} as any)
    jest.spyOn(github.rest.repos, 'getBranchProtection').mockImplementationOnce(() => {
      throw {status: 404, message: 'Not Found'}
    })

    const result = await getBranchProtectionStatus('feature', true, false)
    expect(result).toEqual({isProtected: false, protectionType: '', canDelete: true})
    expect(debugSpy).toHaveBeenCalledWith('No branch protection found for feature (404 - expected for unprotected branches)')
    debugSpy.mockRestore()
  })

  it('handles permission issues with rulesets specifically', async () => {
    const core = require('@actions/core')
    const warningSpy = jest.spyOn(core, 'warning').mockImplementation()
    jest.spyOn(github.rest.repos, 'get').mockResolvedValueOnce({data: {default_branch: 'main'}} as any)
    jest.spyOn(github.rest.repos, 'getBranchRules').mockRejectedValueOnce({status: 403, message: 'Forbidden'})

    const result = await getBranchProtectionStatus('feature', false, true)
    expect(result).toEqual({isProtected: false, protectionType: 'unknown (permission denied)', canDelete: true})
    expect(warningSpy).toHaveBeenCalledWith(expect.stringContaining('GitHub token lacks permission to read repository rulesets for feature'))
    warningSpy.mockRestore()
  })

  it('handles mixed protection types with permission issues', async () => {
    const core = require('@actions/core')
    const warningSpy = jest.spyOn(core, 'warning').mockImplementation()
    jest.spyOn(github.rest.repos, 'get').mockResolvedValueOnce({data: {default_branch: 'main'}} as any)
    jest.spyOn(github.rest.repos, 'getBranchProtection').mockResolvedValueOnce({data: {allow_deletions: {enabled: false}}} as any)
    jest.spyOn(github.rest.repos, 'getBranchRules').mockRejectedValueOnce({status: 403, message: 'Forbidden'})

    const result = await getBranchProtectionStatus('feature', true, true)
    expect(result.isProtected).toBe(true)
    expect(result.canDelete).toBe(true)
    expect(result.protectionType).toBe('branch protection (partial check - permission denied)')
    expect(warningSpy).toHaveBeenCalledWith(expect.stringContaining('GitHub token lacks permission to read repository rulesets for feature'))
    warningSpy.mockRestore()
  })
})
