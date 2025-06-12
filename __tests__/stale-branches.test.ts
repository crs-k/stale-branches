jest.mock('@actions/core')
jest.mock('../src/functions/get-context')
jest.mock('../src/functions/get-branches')
jest.mock('../src/functions/utils/filter-branches')
jest.mock('../src/functions/get-issues')
jest.mock('../src/functions/get-stale-issue-budget')
jest.mock('../src/functions/get-default-branch')
jest.mock('../src/functions/get-commit-age')
jest.mock('../src/functions/get-commit-info')
jest.mock('../src/functions/compare-branches')
jest.mock('../src/functions/create-issue')
jest.mock('../src/functions/create-issue-comment')
jest.mock('../src/functions/close-issue')
jest.mock('../src/functions/delete-branch')
jest.mock('../src/functions/get-rate-limit')
jest.mock('../src/functions/get-pr')
jest.mock('../src/functions/get-branch-protection')

const core = require('@actions/core')
import {run} from '../src/stale-branches'
import {validateInputs} from '../src/functions/get-context'
import {getBranches} from '../src/functions/get-branches'
import {filterBranches} from '../src/functions/utils/filter-branches'
import {getIssues} from '../src/functions/get-issues'
import {getIssueBudget} from '../src/functions/get-stale-issue-budget'
import {getDefaultBranch} from '../src/functions/get-default-branch'
import {getRecentCommitAge} from '../src/functions/get-commit-age'
import {getRecentCommitInfo} from '../src/functions/get-commit-info'
import {compareBranches} from '../src/functions/compare-branches'
import {createIssue} from '../src/functions/create-issue'
import {createIssueComment} from '../src/functions/create-issue-comment'
import {closeIssue} from '../src/functions/close-issue'
import {deleteBranch} from '../src/functions/delete-branch'
import {getRateLimit} from '../src/functions/get-rate-limit'
import {getPr} from '../src/functions/get-pr'
import {getBranchProtectionStatus} from '../src/functions/get-branch-protection'

const mockValidateInputs = validateInputs as jest.MockedFunction<typeof validateInputs>
const mockGetBranches = getBranches as jest.MockedFunction<typeof getBranches>
const mockFilterBranches = filterBranches as jest.MockedFunction<typeof filterBranches>
const mockGetIssues = getIssues as jest.MockedFunction<typeof getIssues>
const mockGetIssueBudget = getIssueBudget as jest.MockedFunction<typeof getIssueBudget>
const mockGetDefaultBranch = getDefaultBranch as jest.MockedFunction<typeof getDefaultBranch>
const mockGetRecentCommitAge = getRecentCommitAge as jest.MockedFunction<typeof getRecentCommitAge>
const mockGetRecentCommitInfo = getRecentCommitInfo as jest.MockedFunction<typeof getRecentCommitInfo>
const mockCompareBranches = compareBranches as jest.MockedFunction<typeof compareBranches>
const mockCreateIssue = createIssue as jest.MockedFunction<typeof createIssue>
const mockCreateIssueComment = createIssueComment as jest.MockedFunction<typeof createIssueComment>
const mockCloseIssue = closeIssue as jest.MockedFunction<typeof closeIssue>
const mockDeleteBranch = deleteBranch as jest.MockedFunction<typeof deleteBranch>
const mockGetRateLimit = getRateLimit as jest.MockedFunction<typeof getRateLimit>
const mockGetPr = getPr as jest.MockedFunction<typeof getPr>
const mockGetBranchProtectionStatus = getBranchProtectionStatus as jest.MockedFunction<typeof getBranchProtectionStatus>

describe('Stale Branches Main Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Setup default mocks
    core.setOutput = jest.fn()
    core.startGroup = jest.fn()
    core.endGroup = jest.fn()
    core.info = jest.fn()
    core.setFailed = jest.fn()
    
    // Mock a basic valid input configuration
    mockValidateInputs.mockResolvedValue({
      daysBeforeStale: 30,
      daysBeforeDelete: 90,
      commentUpdates: true,
      maxIssues: 5,
      tagLastCommitter: true,
      staleBranchLabel: 'stale',
      compareBranches: 'off',
      rateLimit: false,
      prCheck: false,
      dryRun: false,
      ignoreIssueInteraction: false,
      includeProtectedBranches: false,
      branchesFilterRegex: '',
      ignoreDefaultBranchCommits: false // Avoid GitHub API calls
    })
    
    mockGetBranches.mockResolvedValue([
      {branchName: 'feature-1', commmitSha: 'sha1'},
      {branchName: 'feature-2', commmitSha: 'sha2'}
    ])
    
    mockFilterBranches.mockResolvedValue([
      {branchName: 'feature-1', commmitSha: 'sha1'},
      {branchName: 'feature-2', commmitSha: 'sha2'}
    ])
    
    mockGetIssues.mockResolvedValue([])
    mockGetIssueBudget.mockResolvedValue(5)
    mockGetDefaultBranch.mockResolvedValue('main')
    mockGetRecentCommitAge.mockResolvedValue(45) // Stale but not old enough to delete
    mockGetRecentCommitInfo.mockResolvedValue({
      committer: 'testuser',
      age: 45,
      ignoredCount: 0,
      usedFallback: false
    })
    mockCompareBranches.mockResolvedValue({
      branchStatus: 'ahead',
      aheadBy: 1,
      behindBy: 0,
      totalCommits: 1,
      save: false
    })
    mockCreateIssue.mockResolvedValue(123)
    mockGetRateLimit.mockResolvedValue({
      used: 10,
      remaining: 90,
      reset: 60,
      resetDateTime: new Date()
    })
    mockGetPr.mockResolvedValue(0)
    mockGetBranchProtectionStatus.mockResolvedValue({
      isProtected: false,
      canDelete: true,
      protectionType: ''
    })
  })

  test('runs successfully with default configuration', async () => {
    await run()
    
    expect(mockValidateInputs).toHaveBeenCalled()
    expect(mockGetBranches).toHaveBeenCalled()
    expect(mockFilterBranches).toHaveBeenCalled()
    expect(mockGetIssues).toHaveBeenCalled()
    expect(core.setOutput).toHaveBeenCalledWith('stale-branches', JSON.stringify(['feature-1', 'feature-2']))
    expect(core.setOutput).toHaveBeenCalledWith('deleted-branches', JSON.stringify([]))
  })

  test('handles error gracefully', async () => {
    mockValidateInputs.mockRejectedValueOnce(new Error('Validation failed'))
    
    await run()
    
    expect(core.setFailed).toHaveBeenCalledWith('Action failed. Error: Validation failed')
  })

  test('handles invalid inputs error', async () => {
    mockValidateInputs.mockResolvedValueOnce({
      daysBeforeStale: null as any,
      daysBeforeDelete: 90,
      commentUpdates: true,
      maxIssues: 5,
      tagLastCommitter: true,
      staleBranchLabel: 'stale',
      compareBranches: 'off',
      rateLimit: false,
      prCheck: false,
      dryRun: false,
      ignoreIssueInteraction: false,
      includeProtectedBranches: false,
      branchesFilterRegex: ''
    })
    
    await run()
    
    expect(core.setFailed).toHaveBeenCalledWith('Action failed. Error: Invalid inputs')
  })
})