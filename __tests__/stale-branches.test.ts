// Mock all dependencies first
jest.mock('@actions/core')
jest.mock('../src/functions/close-issue')
jest.mock('../src/functions/compare-branches')
jest.mock('../src/functions/create-issue')
jest.mock('../src/functions/create-issue-comment')
jest.mock('../src/functions/utils/create-issues-title-string')
jest.mock('../src/functions/delete-branch')
jest.mock('../src/functions/get-branches')
jest.mock('../src/functions/get-stale-issue-budget')
jest.mock('../src/functions/get-issues')
jest.mock('../src/functions/get-rate-limit')
jest.mock('../src/functions/get-commit-age')
jest.mock('../src/functions/get-committer-login')
jest.mock('../src/functions/get-context')
jest.mock('../src/functions/utils/filter-branches')
jest.mock('../src/functions/get-pr')

// Import actual modules and mocked functions
import * as core from '@actions/core'
import {run} from '../src/stale-branches'
import {closeIssue} from '../src/functions/close-issue'
import {compareBranches} from '../src/functions/compare-branches'
import {createIssue} from '../src/functions/create-issue'
import {createIssueComment} from '../src/functions/create-issue-comment'
import {createIssueTitleString} from '../src/functions/utils/create-issues-title-string'
import {deleteBranch} from '../src/functions/delete-branch'
import {getBranches} from '../src/functions/get-branches'
import {getIssueBudget} from '../src/functions/get-stale-issue-budget'
import {getIssues} from '../src/functions/get-issues'
import {getRateLimit} from '../src/functions/get-rate-limit'
import {getRecentCommitAge, getRecentCommitAgeByNonIgnoredMessage} from '../src/functions/get-commit-age'
import {getRecentCommitLogin} from '../src/functions/get-committer-login'
import {validateInputs} from '../src/functions/get-context'
import {filterBranches} from '../src/functions/utils/filter-branches'
import {getPr} from '../src/functions/get-pr'

// Create typed mocks
const mockCore = core as jest.Mocked<typeof core>
const mockCloseIssue = closeIssue as jest.MockedFunction<typeof closeIssue>
const mockCompareBranches = compareBranches as jest.MockedFunction<typeof compareBranches>
const mockCreateIssue = createIssue as jest.MockedFunction<typeof createIssue>
const mockCreateIssueComment = createIssueComment as jest.MockedFunction<typeof createIssueComment>
const mockCreateIssueTitleString = createIssueTitleString as jest.MockedFunction<typeof createIssueTitleString>
const mockDeleteBranch = deleteBranch as jest.MockedFunction<typeof deleteBranch>
const mockGetBranches = getBranches as jest.MockedFunction<typeof getBranches>
const mockGetIssueBudget = getIssueBudget as jest.MockedFunction<typeof getIssueBudget>
const mockGetIssues = getIssues as jest.MockedFunction<typeof getIssues>
const mockGetRateLimit = getRateLimit as jest.MockedFunction<typeof getRateLimit>
const mockGetRecentCommitAge = getRecentCommitAge as jest.MockedFunction<typeof getRecentCommitAge>
const mockGetRecentCommitAgeByNonIgnoredMessage = getRecentCommitAgeByNonIgnoredMessage as jest.MockedFunction<typeof getRecentCommitAgeByNonIgnoredMessage>
const mockGetRecentCommitLogin = getRecentCommitLogin as jest.MockedFunction<typeof getRecentCommitLogin>
const mockValidateInputs = validateInputs as jest.MockedFunction<typeof validateInputs>
const mockFilterBranches = filterBranches as jest.MockedFunction<typeof filterBranches>
const mockGetPr = getPr as jest.MockedFunction<typeof getPr>

describe('stale-branches run function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Default mock implementations
    mockValidateInputs.mockResolvedValue({
      daysBeforeStale: 30,
      daysBeforeDelete: 60,
      maxIssues: 10,
      staleBranchLabel: 'stale-branch',
      includeProtectedBranches: false,
      branchesFilterRegex: undefined,
      commentUpdates: true,
      tagLastCommitter: true,
      prCheck: false,
      ignoreIssueInteraction: false,
      dryRun: false,
      rateLimit: false,
      compareBranches: 'main',
      ignoreCommitMessages: ''
    })
    
    mockGetBranches.mockResolvedValue([
      { branchName: 'feature-branch-1', commmitSha: 'abc123' },
      { branchName: 'feature-branch-2', commmitSha: 'def456' }
    ])
    
    mockFilterBranches.mockResolvedValue([
      { branchName: 'feature-branch-1', commmitSha: 'abc123' },
      { branchName: 'feature-branch-2', commmitSha: 'def456' }
    ])
    
    mockGetIssues.mockResolvedValue([])
    mockGetIssueBudget.mockResolvedValue(10)
    mockGetRecentCommitAge.mockResolvedValue(45)
    mockGetRecentCommitLogin.mockResolvedValue('test-user')
    mockCreateIssueTitleString.mockReturnValue('Stale Branch: feature-branch-1')
    mockCompareBranches.mockResolvedValue({ 
      branchStatus: 'ahead',
      aheadBy: 2,
      behindBy: 0,
      totalCommits: 5,
      save: false 
    })
    mockGetPr.mockResolvedValue(0)
    mockGetRateLimit.mockResolvedValue({ 
      used: 50, 
      remaining: 50,
      reset: 30,
      resetDateTime: new Date()
    })
    
    mockCore.info = jest.fn()
    mockCore.startGroup = jest.fn()
    mockCore.endGroup = jest.fn()
    mockCore.setOutput = jest.fn()
    mockCore.setFailed = jest.fn()
  })

  it('should successfully process branches and create issues for stale branches', async () => {
    await run()

    expect(mockValidateInputs).toHaveBeenCalledTimes(1)
    expect(mockGetBranches).toHaveBeenCalledWith(false)
    expect(mockFilterBranches).toHaveBeenCalledWith(expect.any(Array), '')
    expect(mockGetIssues).toHaveBeenCalledWith('stale-branch')
    expect(mockGetIssueBudget).toHaveBeenCalledWith(10, 'stale-branch')
    expect(mockCreateIssue).toHaveBeenCalledTimes(2) // Two stale branches
    expect(mockCore.setOutput).toHaveBeenCalledWith('stale-branches', JSON.stringify(['feature-branch-1', 'feature-branch-2']))
    expect(mockCore.setOutput).toHaveBeenCalledWith('deleted-branches', JSON.stringify([]))
  })

  it('should delete branches that exceed days-before-delete', async () => {
    mockGetRecentCommitAge.mockResolvedValue(70) // Older than 60 days

    await run()

    expect(mockDeleteBranch).toHaveBeenCalledTimes(2)
    expect(mockDeleteBranch).toHaveBeenCalledWith('feature-branch-1')
    expect(mockDeleteBranch).toHaveBeenCalledWith('feature-branch-2')
    expect(mockCore.setOutput).toHaveBeenCalledWith('deleted-branches', JSON.stringify(['feature-branch-1', 'feature-branch-2']))
  })

  it('should skip branches with active pull requests when prCheck is enabled', async () => {
    mockValidateInputs.mockResolvedValue({
      daysBeforeStale: 30,
      daysBeforeDelete: 60,
      maxIssues: 10,
      staleBranchLabel: 'stale-branch',
      includeProtectedBranches: false,
      branchesFilterRegex: undefined,
      commentUpdates: true,
      tagLastCommitter: true,
      prCheck: true, // Enable PR check
      ignoreIssueInteraction: false,
      dryRun: false,
      rateLimit: false,
      compareBranches: 'main',
      ignoreCommitMessages: ''
    })
    
    mockGetPr.mockResolvedValue(1) // Active PR exists

    await run()

    expect(mockGetPr).toHaveBeenCalledTimes(2)
    expect(mockCreateIssue).not.toHaveBeenCalled() // Should skip creating issues
    expect(mockCore.setOutput).toHaveBeenCalledWith('stale-branches', JSON.stringify([]))
  })

  it('should handle dry run mode correctly', async () => {
    mockValidateInputs.mockResolvedValue({
      daysBeforeStale: 30,
      daysBeforeDelete: 60,
      maxIssues: 10,
      staleBranchLabel: 'stale-branch',
      includeProtectedBranches: false,
      branchesFilterRegex: undefined,
      commentUpdates: true,
      tagLastCommitter: true,
      prCheck: false,
      ignoreIssueInteraction: false,
      dryRun: true, // Enable dry run
      rateLimit: false,
      compareBranches: 'main',
      ignoreCommitMessages: ''
    })

    await run()

    expect(mockCreateIssue).not.toHaveBeenCalled()
    expect(mockDeleteBranch).not.toHaveBeenCalled()
    expect(mockCore.info).toHaveBeenCalledWith(expect.stringContaining('Dry Run: Issue would be created for branch:'))
  })

  it('should respect issue budget limitations', async () => {
    mockGetIssueBudget.mockResolvedValue(1) // Only 1 issue allowed

    await run()

    expect(mockCreateIssue).toHaveBeenCalledTimes(1) // Only one issue created
  })

  it('should close issues for branches that become active again', async () => {
    mockGetRecentCommitAge.mockResolvedValue(15) // Less than 30 days (active)
    mockGetIssues.mockResolvedValue([
      { issueNumber: 123, issueTitle: 'Stale Branch: feature-branch-1' }
    ])

    await run()

    expect(mockCloseIssue).toHaveBeenCalledWith(123)
  })

  it('should update existing issues for stale branches', async () => {
    mockGetIssues.mockResolvedValue([
      { issueNumber: 123, issueTitle: 'Stale Branch: feature-branch-1' }
    ])

    await run()

    expect(mockCreateIssueComment).toHaveBeenCalledWith(
      123,
      'feature-branch-1',
      45,
      'test-user',
      true,
      60,
      'stale-branch',
      true
    )
  })

  it('should handle rate limit checks when enabled', async () => {
    mockValidateInputs.mockResolvedValue({
      daysBeforeStale: 30,
      daysBeforeDelete: 60,
      maxIssues: 10,
      staleBranchLabel: 'stale-branch',
      includeProtectedBranches: false,
      branchesFilterRegex: undefined,
      commentUpdates: true,
      tagLastCommitter: true,
      prCheck: false,
      ignoreIssueInteraction: false,
      dryRun: false,
      rateLimit: true, // Enable rate limit check
      compareBranches: 'main',
      ignoreCommitMessages: ''
    })
    
    mockGetRateLimit.mockResolvedValue({ 
      used: 96, 
      remaining: 4, 
      reset: 60,
      resetDateTime: new Date(Date.now() + 60 * 60 * 1000)
    }) // Over 95% used

    await run()

    expect(mockGetRateLimit).toHaveBeenCalled()
    expect(mockCore.setFailed).toHaveBeenCalledWith('Exiting to avoid rate limit violation.')
  })

  it('should use ignored commit messages when specified', async () => {
    mockValidateInputs.mockResolvedValue({
      daysBeforeStale: 30,
      daysBeforeDelete: 60,
      maxIssues: 10,
      staleBranchLabel: 'stale-branch',
      includeProtectedBranches: false,
      branchesFilterRegex: undefined,
      commentUpdates: true,
      tagLastCommitter: true,
      prCheck: false,
      ignoreIssueInteraction: false,
      dryRun: false,
      rateLimit: false,
      compareBranches: 'main',
      ignoreCommitMessages: 'merge,update deps' // Ignore certain messages
    })

    await run()

    expect(mockGetRecentCommitAgeByNonIgnoredMessage).toHaveBeenCalledWith(
      'abc123',
      ['merge', 'update deps'],
      60
    )
  })

  it('should close orphaned issues', async () => {
    mockGetIssues.mockResolvedValue([
      { issueNumber: 456, issueTitle: 'Stale Branch: deleted-branch' }
    ])

    await run()

    expect(mockCloseIssue).toHaveBeenCalledWith(456)
  })

  it('should handle ignoreIssueInteraction mode', async () => {
    mockValidateInputs.mockResolvedValue({
      daysBeforeStale: 30,
      daysBeforeDelete: 60,
      maxIssues: 10,
      staleBranchLabel: 'stale-branch',
      includeProtectedBranches: false,
      branchesFilterRegex: undefined,
      commentUpdates: true,
      tagLastCommitter: true,
      prCheck: false,
      ignoreIssueInteraction: true, // Ignore issue interactions
      dryRun: false,
      rateLimit: false,
      compareBranches: 'main',
      ignoreCommitMessages: ''
    })

    await run()

    expect(mockCreateIssue).not.toHaveBeenCalled()
    expect(mockCore.info).toHaveBeenCalledWith(expect.stringContaining('Ignoring issue interaction: Issue would be created for branch:'))
  })

  it('should handle errors gracefully', async () => {
    const error = new Error('Test error')
    mockValidateInputs.mockRejectedValue(error)

    await run()

    expect(mockCore.setFailed).toHaveBeenCalledWith('Action failed. Error: Test error')
  })

  it('should handle invalid inputs error', async () => {
    // Mock validateInputs to return null daysBeforeStale which triggers invalid inputs error
    mockValidateInputs.mockResolvedValue({
      daysBeforeStale: null as any, // This will trigger the "Invalid inputs" error
      daysBeforeDelete: 60,
      maxIssues: 10,
      staleBranchLabel: 'stale-branch',
      includeProtectedBranches: false,
      branchesFilterRegex: undefined,
      commentUpdates: true,
      tagLastCommitter: true,
      prCheck: false,
      ignoreIssueInteraction: false,
      dryRun: false,
      rateLimit: false,
      compareBranches: 'main',
      ignoreCommitMessages: ''
    })

    await run()

    expect(mockCore.setFailed).toHaveBeenCalledWith('Action failed. Error: Invalid inputs')
  })

  it('should not tag last committer when tagLastCommitter is false', async () => {
    mockValidateInputs.mockResolvedValue({
      daysBeforeStale: 30,
      daysBeforeDelete: 60,
      maxIssues: 10,
      staleBranchLabel: 'stale-branch',
      includeProtectedBranches: false,
      branchesFilterRegex: undefined,
      commentUpdates: true,
      tagLastCommitter: false, // Don't tag last committer
      prCheck: false,
      ignoreIssueInteraction: false,
      dryRun: false,
      rateLimit: false,
      compareBranches: 'main',
      ignoreCommitMessages: ''
    })

    await run()

    expect(mockGetRecentCommitLogin).not.toHaveBeenCalled()
  })

  it('should preserve branches when comparison indicates save=true', async () => {
    mockGetRecentCommitAge.mockResolvedValue(70) // Older than delete threshold
    mockCompareBranches.mockResolvedValue({ 
      branchStatus: 'ahead', 
      aheadBy: 5, 
      behindBy: 0, 
      totalCommits: 5, 
      save: true 
    }) // But should be saved

    await run()

    expect(mockDeleteBranch).not.toHaveBeenCalled() // Should not delete
  })
})
