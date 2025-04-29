import {BranchResponse} from '../../src/types/branches'
import {github} from '../../src/functions/get-context'
import {checkBranchProtection} from '../../src/functions/check-branch-protection'
import {RulesetResponse} from '../../src/types/github-api'

jest.mock('@octokit/request-error', () => {
  return {
    RequestError: class extends Error {
      status: number
      constructor(message: string, status: number) {
        super(message)
        this.status = status
      }
    }
  }
})

function createBranchTestData() {
  const branches: BranchResponse[] = [
    {branchName: 'branch1', commmitSha: '12345'},
    {branchName: 'branch2', commmitSha: '67890'},
    {branchName: 'main', commmitSha: '99999'} // Adding default branch
  ]
  return branches
}

describe('Check Branch Protection Function', () => {
  let branches: BranchResponse[]

  beforeEach(() => {
    jest.clearAllMocks()
    branches = createBranchTestData()
  })

  it('skips the default branch and keeps unprotected branches', async () => {
    const mockGet = jest.fn().mockResolvedValueOnce({data: {default_branch: 'main'}})
    const mockGetBranchProtection = jest.fn().mockResolvedValue({data: {allow_deletions: {enabled: true}}})
    const mockGetBranchRules = jest.fn().mockResolvedValue({data: []})

    github.rest.repos.get = mockGet as unknown as typeof github.rest.repos.get
    github.rest.repos.getBranchProtection = mockGetBranchProtection as unknown as typeof github.rest.repos.getBranchProtection
    github.rest.repos.getBranchRules = mockGetBranchRules as unknown as typeof github.rest.repos.getBranchRules

    await checkBranchProtection(branches)

    // Default branch should remain in the array, and other branches should be kept since they're unprotected
    expect(branches).toEqual([
      {branchName: 'branch1', commmitSha: '12345'},
      {branchName: 'branch2', commmitSha: '67890'},
      {branchName: 'main', commmitSha: '99999'}
    ])
  })

  it('removes branches that do not allow deletions via legacy protection', async () => {
    const mockGet = jest.fn().mockResolvedValueOnce({data: {default_branch: 'main'}})
    const mockGetBranchProtection = jest
      .fn()
      .mockResolvedValueOnce({data: {allow_deletions: {enabled: false}}})
      .mockResolvedValueOnce({data: {allow_deletions: {enabled: true}}})
    const mockGetBranchRules = jest.fn().mockResolvedValue({data: []})

    github.rest.repos.get = mockGet as unknown as typeof github.rest.repos.get
    github.rest.repos.getBranchProtection = mockGetBranchProtection as unknown as typeof github.rest.repos.getBranchProtection
    github.rest.repos.getBranchRules = mockGetBranchRules as unknown as typeof github.rest.repos.getBranchRules

    await checkBranchProtection(branches)

    expect(branches).toEqual([
      {branchName: 'branch2', commmitSha: '67890'},
      {branchName: 'main', commmitSha: '99999'}
    ])
  })

  it('removes branches that do not allow deletions via rulesets', async () => {
    const mockGet = jest.fn().mockResolvedValueOnce({data: {default_branch: 'main'}})
    const mockGetBranchProtection = jest.fn().mockResolvedValue({data: {allow_deletions: {enabled: true}}})
    const mockGetBranchRules = jest
      .fn()
      .mockResolvedValueOnce({data: [{type: 'deletion', deletion: false}]})
      .mockResolvedValueOnce({data: []})

    github.rest.repos.get = mockGet as unknown as typeof github.rest.repos.get
    github.rest.repos.getBranchProtection = mockGetBranchProtection as unknown as typeof github.rest.repos.getBranchProtection
    github.rest.repos.getBranchRules = mockGetBranchRules as unknown as typeof github.rest.repos.getBranchRules

    await checkBranchProtection(branches)

    expect(branches).toEqual([
      {branchName: 'branch2', commmitSha: '67890'},
      {branchName: 'main', commmitSha: '99999'}
    ])
  })

  it('keeps branches that allow deletions in both systems', async () => {
    const mockGet = jest.fn().mockResolvedValueOnce({data: {default_branch: 'main'}})
    const mockGetBranchProtection = jest.fn().mockResolvedValue({data: {allow_deletions: {enabled: true}}})
    const mockGetBranchRules = jest.fn().mockResolvedValue({data: []})

    github.rest.repos.get = mockGet as unknown as typeof github.rest.repos.get
    github.rest.repos.getBranchProtection = mockGetBranchProtection as unknown as typeof github.rest.repos.getBranchProtection
    github.rest.repos.getBranchRules = mockGetBranchRules as unknown as typeof github.rest.repos.getBranchRules

    await checkBranchProtection(branches)

    expect(branches).toEqual([
      {branchName: 'branch1', commmitSha: '12345'},
      {branchName: 'branch2', commmitSha: '67890'},
      {branchName: 'main', commmitSha: '99999'}
    ])
  })

  it('handles errors when retrieving default branch', async () => {
    const mockGet = jest.fn().mockRejectedValueOnce(new Error('Failed to get default branch'))
    const mockGetBranchProtection = jest.fn().mockResolvedValue({data: {allow_deletions: {enabled: true}}})
    const mockGetBranchRules = jest.fn().mockResolvedValue({data: []})

    github.rest.repos.get = mockGet as unknown as typeof github.rest.repos.get
    github.rest.repos.getBranchProtection = mockGetBranchProtection as unknown as typeof github.rest.repos.getBranchProtection
    github.rest.repos.getBranchRules = mockGetBranchRules as unknown as typeof github.rest.repos.getBranchRules

    await checkBranchProtection(branches)

    // Should return early and not modify branches
    expect(branches).toEqual(createBranchTestData())
  })

  it('handles errors when retrieving branch protection', async () => {
    const mockGet = jest.fn().mockResolvedValueOnce({data: {default_branch: 'main'}})
    const mockGetBranchProtection = jest
      .fn()
      .mockRejectedValueOnce(new Error('Error retrieving branch protection'))
      .mockResolvedValueOnce({data: {allow_deletions: {enabled: true}}})
    const mockGetBranchRules = jest.fn().mockResolvedValue({data: []})

    github.rest.repos.get = mockGet as unknown as typeof github.rest.repos.get
    github.rest.repos.getBranchProtection = mockGetBranchProtection as unknown as typeof github.rest.repos.getBranchProtection
    github.rest.repos.getBranchRules = mockGetBranchRules as unknown as typeof github.rest.repos.getBranchRules

    await checkBranchProtection(branches)

    expect(branches).toEqual([
      {branchName: 'branch1', commmitSha: '12345'},
      {branchName: 'branch2', commmitSha: '67890'},
      {branchName: 'main', commmitSha: '99999'}
    ])
  })

  it('handles errors when retrieving rulesets', async () => {
    const mockGet = jest.fn().mockResolvedValueOnce({data: {default_branch: 'main'}})
    const mockGetBranchProtection = jest.fn().mockResolvedValue({data: {allow_deletions: {enabled: true}}})
    const mockGetBranchRules = jest.fn().mockRejectedValueOnce(new Error('Error retrieving rulesets')).mockResolvedValueOnce({data: []})

    github.rest.repos.get = mockGet as unknown as typeof github.rest.repos.get
    github.rest.repos.getBranchProtection = mockGetBranchProtection as unknown as typeof github.rest.repos.getBranchProtection
    github.rest.repos.getBranchRules = mockGetBranchRules as unknown as typeof github.rest.repos.getBranchRules

    await checkBranchProtection(branches)

    expect(branches).toEqual([
      {branchName: 'branch1', commmitSha: '12345'},
      {branchName: 'branch2', commmitSha: '67890'},
      {branchName: 'main', commmitSha: '99999'}
    ])
  })

  it('removes multiple branches that do not allow deletions in either system', async () => {
    const mockGet = jest.fn().mockResolvedValueOnce({data: {default_branch: 'main'}})
    const mockGetBranchProtection = jest
      .fn()
      .mockResolvedValueOnce({data: {allow_deletions: {enabled: false}}})
      .mockResolvedValueOnce({data: {allow_deletions: {enabled: false}}})
    const mockGetBranchRules = jest
      .fn()
      .mockResolvedValueOnce({data: [{type: 'deletion', deletion: false}]})
      .mockResolvedValueOnce({data: [{type: 'deletion', deletion: false}]})

    github.rest.repos.get = mockGet as unknown as typeof github.rest.repos.get
    github.rest.repos.getBranchProtection = mockGetBranchProtection as unknown as typeof github.rest.repos.getBranchProtection
    github.rest.repos.getBranchRules = mockGetBranchRules as unknown as typeof github.rest.repos.getBranchRules

    await checkBranchProtection(branches)

    expect(branches).toEqual([{branchName: 'main', commmitSha: '99999'}])
  })
})
