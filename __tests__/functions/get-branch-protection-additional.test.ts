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
describe('getBranchProtectionStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    core.getInput = jest.fn().mockReturnValue('false')
  })

  // Coverage for the repo error case
  it('returns unprotected when repo.get throws an error', async () => {
    jest.spyOn(github.rest.repos, 'get').mockRejectedValueOnce(new Error('Failed to get repo info'))
    
    const result = await getBranchProtectionStatus('feature')
    
    expect(result.isProtected).toBe(false)
    expect(result.canDelete).toBe(true)
    expect(result.protectionType).toBe('')
  })

  // Coverage for non-404 error from getBranchProtection
  it('handles non-404 errors from getBranchProtection by setting protection to true', async () => {
    jest.spyOn(github.rest.repos, 'get').mockResolvedValueOnce({data: {default_branch: 'main'}} as any)
    jest.spyOn(github.rest.repos, 'getBranchProtection').mockRejectedValueOnce({
      status: 500,
      message: 'Internal server error'
    })
    jest.spyOn(github.rest.repos, 'getBranchRules').mockResolvedValueOnce({
      data: [] as any,
      headers: {},
      status: 200,
      url: 'mock-url'
    })
    
    const result = await getBranchProtectionStatus('feature')
    
    expect(result.isProtected).toBe(true)
    expect(result.canDelete).toBe(false)
    expect(result.protectionType).toBe('error')
  })

  // Coverage for branch with deletions allowed
  it('correctly handles branch with protection but deletions allowed', async () => {
    jest.spyOn(github.rest.repos, 'get').mockResolvedValueOnce({data: {default_branch: 'main'}} as any)
    jest.spyOn(github.rest.repos, 'getBranchProtection').mockResolvedValueOnce({
      data: {allow_deletions: {enabled: true}} 
    } as any)
    jest.spyOn(github.rest.repos, 'getBranchRules').mockResolvedValueOnce({
      data: [] as any,
      headers: {},
      status: 200,
      url: 'mock-url'
    })
    
    const result = await getBranchProtectionStatus('feature')
    
    expect(result.isProtected).toBe(false)
    expect(result.canDelete).toBe(true)
  })

  // Coverage for error in getBranchRules
  it('handles errors in getBranchRules', async () => {
    jest.spyOn(github.rest.repos, 'get').mockResolvedValueOnce({data: {default_branch: 'main'}} as any)
    jest.spyOn(github.rest.repos, 'getBranchProtection').mockImplementationOnce(() => {
      throw {status: 404}
    })
    jest.spyOn(github.rest.repos, 'getBranchRules').mockRejectedValueOnce(new Error('Failed to get branch rules'))
    
    const result = await getBranchProtectionStatus('feature')
    
    expect(result.isProtected).toBe(false)
    expect(result.canDelete).toBe(true)
  })
})
