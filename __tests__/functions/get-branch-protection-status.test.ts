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

  it('returns protected for default branch', async () => {
    jest.spyOn(github.rest.repos, 'get').mockResolvedValueOnce({data: {default_branch: 'main'}} as any)
    const result = await getBranchProtectionStatus('main')
    expect(result.isProtected).toBe(true)
    expect(result.canDelete).toBe(false)
    expect(result.protectionType).toBe('default branch')
  })

  it('returns unprotected for branch with no protection', async () => {
    jest.spyOn(github.rest.repos, 'get').mockResolvedValueOnce({data: {default_branch: 'main'}} as any)
    jest.spyOn(github.rest.repos, 'getBranchProtection').mockImplementationOnce(() => {
      throw {status: 404}
    })
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

  it('returns protected for branch protection', async () => {
    jest.spyOn(github.rest.repos, 'get').mockResolvedValueOnce({data: {default_branch: 'main'}} as any)
    jest.spyOn(github.rest.repos, 'getBranchProtection').mockResolvedValueOnce({data: {allow_deletions: {enabled: false}}} as any)
    jest.spyOn(github.rest.repos, 'getBranchRules').mockResolvedValueOnce({
      data: [] as any,
      headers: {},
      status: 200,
      url: 'mock-url'
    })
    const result = await getBranchProtectionStatus('feature')
    expect(result.isProtected).toBe(true)
    expect(result.canDelete).toBe(false)
    expect(result.protectionType).toBe('branch protection')
  })

  it('returns protected for ruleset', async () => {
    jest.spyOn(github.rest.repos, 'get').mockResolvedValueOnce({data: {default_branch: 'main'}} as any)
    jest.spyOn(github.rest.repos, 'getBranchProtection').mockImplementationOnce(() => {
      throw {status: 404}
    })
    jest.spyOn(github.rest.repos, 'getBranchRules').mockResolvedValueOnce({
      data: [{deletion: false}] as any,
      headers: {},
      status: 200,
      url: 'mock-url'
    })
    const result = await getBranchProtectionStatus('feature')
    expect(result.isProtected).toBe(true)
    expect(result.canDelete).toBe(false)
    expect(result.protectionType).toBe('ruleset')
  })

  it('returns protected for both branch protection and ruleset', async () => {
    jest.spyOn(github.rest.repos, 'get').mockResolvedValueOnce({data: {default_branch: 'main'}} as any)
    jest.spyOn(github.rest.repos, 'getBranchProtection').mockResolvedValueOnce({data: {allow_deletions: {enabled: false}}} as any)
    jest.spyOn(github.rest.repos, 'getBranchRules').mockResolvedValueOnce({
      data: [{deletion: false}] as any,
      headers: {},
      status: 200,
      url: 'mock-url'
    })
    const result = await getBranchProtectionStatus('feature')
    expect(result.isProtected).toBe(true)
    expect(result.canDelete).toBe(false)
    expect(result.protectionType).toBe('branch protection and ruleset')
  })

  it('returns canDelete=true if includeProtectedBranches is true', async () => {
    core.getInput = jest.fn(name => (name === 'include-protected-branches' ? 'true' : 'false'))
    jest.spyOn(github.rest.repos, 'get').mockResolvedValueOnce({data: {default_branch: 'main'}} as any)
    jest.spyOn(github.rest.repos, 'getBranchProtection').mockResolvedValueOnce({data: {allow_deletions: {enabled: false}}} as any)
    jest.spyOn(github.rest.repos, 'getBranchRules').mockResolvedValueOnce({
      data: [] as any,
      headers: {},
      status: 200,
      url: 'mock-url'
    })
    const result = await getBranchProtectionStatus('feature')
    expect(result.isProtected).toBe(true)
    expect(result.canDelete).toBe(true)
  })
})
