import * as core from '@actions/core'
import {
  checkRateLimit,
  checkActivePullRequests,
  getBranchCommitAge,
  getLastCommitterLogin,
  prepareBranchAssessment
} from '../../src/functions/branch-processor'
import {getRateLimit} from '../../src/functions/get-rate-limit'
import {getPr} from '../../src/functions/get-pr'
import {getRecentCommitAge, getRecentCommitAgeByNonIgnoredMessage} from '../../src/functions/get-commit-age'
import {getRecentCommitLogin} from '../../src/functions/get-committer-login'
import {createIssueTitleString} from '../../src/functions/utils/create-issues-title-string'
import {compareBranches} from '../../src/functions/compare-branches'
import {Inputs} from '../../src/types/inputs'
import {BranchResponse} from '../../src/types/branches'

// Mock dependencies
jest.mock('@actions/core')
jest.mock('../../src/functions/get-rate-limit')
jest.mock('../../src/functions/get-pr')
jest.mock('../../src/functions/get-commit-age')
jest.mock('../../src/functions/get-committer-login')
jest.mock('../../src/functions/utils/create-issues-title-string')
jest.mock('../../src/functions/compare-branches')

const mockCore = core as jest.Mocked<typeof core>
const mockGetRateLimit = getRateLimit as jest.MockedFunction<typeof getRateLimit>
const mockGetPr = getPr as jest.MockedFunction<typeof getPr>
const mockGetRecentCommitAge = getRecentCommitAge as jest.MockedFunction<typeof getRecentCommitAge>
const mockGetRecentCommitAgeByNonIgnoredMessage = getRecentCommitAgeByNonIgnoredMessage as jest.MockedFunction<typeof getRecentCommitAgeByNonIgnoredMessage>
const mockGetRecentCommitLogin = getRecentCommitLogin as jest.MockedFunction<typeof getRecentCommitLogin>
const mockCreateIssueTitleString = createIssueTitleString as jest.MockedFunction<typeof createIssueTitleString>
const mockCompareBranches = compareBranches as jest.MockedFunction<typeof compareBranches>

describe('Branch Processor Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockValidInputs: Inputs = {
    daysBeforeStale: 7,
    daysBeforeDelete: 14,
    staleBranchLabel: 'stale-branch',
    dryRun: false,
    rateLimit: false,
    prCheck: false,
    tagLastCommitter: false,
    ignoreIssueInteraction: false,
    commentUpdates: false,
    includeProtectedBranches: false,
    compareBranches: 'off',
    ignoreCommitMessages: '',
    maxIssues: 5,
    branchesFilterRegex: ''
  }

  describe('checkRateLimit', () => {
    it('should return false when rate limit is disabled', async () => {
      const inputs = { ...mockValidInputs, rateLimit: false }
      
      const result = await checkRateLimit(inputs)
      
      expect(result).toBe(false)
      expect(mockGetRateLimit).not.toHaveBeenCalled()
    })

    it('should return false when rate limit is below threshold', async () => {
      const inputs = { ...mockValidInputs, rateLimit: true }
      mockGetRateLimit.mockResolvedValue({
        used: 80,
        remaining: 20,
        reset: 30,
        resetDateTime: new Date()
      })

      const result = await checkRateLimit(inputs)

      expect(result).toBe(false)
      expect(mockGetRateLimit).toHaveBeenCalled()
    })

    it('should return true and set failed when rate limit exceeds threshold', async () => {
      const inputs = { ...mockValidInputs, rateLimit: true }
      mockGetRateLimit.mockResolvedValue({
        used: 96,
        remaining: 4,
        reset: 30,
        resetDateTime: new Date()
      })

      const result = await checkRateLimit(inputs)

      expect(result).toBe(true)
      expect(mockGetRateLimit).toHaveBeenCalled()
      expect(mockCore.setFailed).toHaveBeenCalledWith('Exiting to avoid rate limit violation.')
    })
  })

  describe('checkActivePullRequests', () => {
    it('should return shouldSkip false when prCheck is disabled', async () => {
      const inputs = { ...mockValidInputs, prCheck: false }

      const result = await checkActivePullRequests('test-branch', inputs)

      expect(result).toEqual({ shouldSkip: false })
      expect(mockGetPr).not.toHaveBeenCalled()
    })

    it('should return shouldSkip false when no active PRs', async () => {
      const inputs = { ...mockValidInputs, prCheck: true }
      mockGetPr.mockResolvedValue(0)

      const result = await checkActivePullRequests('test-branch', inputs)

      expect(result).toEqual({ shouldSkip: false })
      expect(mockGetPr).toHaveBeenCalledWith('test-branch')
    })

    it('should return shouldSkip true when active PRs exist', async () => {
      const inputs = { ...mockValidInputs, prCheck: true }
      mockGetPr.mockResolvedValue(2)

      const result = await checkActivePullRequests('test-branch', inputs)

      expect(result).toEqual({
        shouldSkip: true,
        reason: 'Active pull requests',
        activePrs: 2
      })
      expect(mockGetPr).toHaveBeenCalledWith('test-branch')
      expect(mockCore.startGroup).toHaveBeenCalled()
      expect(mockCore.endGroup).toHaveBeenCalled()
    })
  })

  describe('getBranchCommitAge', () => {
    it('should use regular commit age when no ignored messages', async () => {
      const inputs = { ...mockValidInputs, ignoreCommitMessages: '' }
      mockGetRecentCommitAge.mockResolvedValue(5)

      const result = await getBranchCommitAge('abc123', inputs)

      expect(result).toBe(5)
      expect(mockGetRecentCommitAge).toHaveBeenCalledWith('abc123')
      expect(mockGetRecentCommitAgeByNonIgnoredMessage).not.toHaveBeenCalled()
    })

    it('should use regular commit age when ignored messages is whitespace', async () => {
      const inputs = { ...mockValidInputs, ignoreCommitMessages: '   ' }
      mockGetRecentCommitAge.mockResolvedValue(5)

      const result = await getBranchCommitAge('abc123', inputs)

      expect(result).toBe(5)
      expect(mockGetRecentCommitAge).toHaveBeenCalledWith('abc123')
      expect(mockGetRecentCommitAgeByNonIgnoredMessage).not.toHaveBeenCalled()
    })

    it('should use ignored message logic when ignored messages provided', async () => {
      const inputs = { ...mockValidInputs, ignoreCommitMessages: 'merge,revert', daysBeforeDelete: 14 }
      mockGetRecentCommitAgeByNonIgnoredMessage.mockResolvedValue(8)

      const result = await getBranchCommitAge('abc123', inputs)

      expect(result).toBe(8)
      expect(mockGetRecentCommitAgeByNonIgnoredMessage).toHaveBeenCalledWith('abc123', ['merge', 'revert'], 14)
      expect(mockGetRecentCommitAge).not.toHaveBeenCalled()
    })

    it('should filter empty strings from ignored messages', async () => {
      const inputs = { ...mockValidInputs, ignoreCommitMessages: 'merge, ,revert, ', daysBeforeDelete: 14 }
      mockGetRecentCommitAgeByNonIgnoredMessage.mockResolvedValue(8)

      const result = await getBranchCommitAge('abc123', inputs)

      expect(result).toBe(8)
      expect(mockGetRecentCommitAgeByNonIgnoredMessage).toHaveBeenCalledWith('abc123', ['merge', 'revert'], 14)
    })
  })

  describe('getLastCommitterLogin', () => {
    it('should return "Unknown" when tagLastCommitter is false', async () => {
      const inputs = { ...mockValidInputs, tagLastCommitter: false }

      const result = await getLastCommitterLogin('abc123', inputs)

      expect(result).toBe('Unknown')
      expect(mockGetRecentCommitLogin).not.toHaveBeenCalled()
    })

    it('should return committer login when tagLastCommitter is true', async () => {
      const inputs = { ...mockValidInputs, tagLastCommitter: true }
      mockGetRecentCommitLogin.mockResolvedValue('testuser')

      const result = await getLastCommitterLogin('abc123', inputs)

      expect(result).toBe('testuser')
      expect(mockGetRecentCommitLogin).toHaveBeenCalledWith('abc123')
    })
  })

  describe('prepareBranchAssessment', () => {
    const mockBranch: BranchResponse = {
      branchName: 'feature/test',
      commmitSha: 'abc123'
    }

    it('should prepare branch assessment with all components', async () => {
      const inputs = { ...mockValidInputs, tagLastCommitter: true }
      
      mockGetRecentCommitAge.mockResolvedValue(10)
      mockCreateIssueTitleString.mockReturnValue('Stale Branch: feature/test')
      mockGetRecentCommitLogin.mockResolvedValue('testuser')
      mockCompareBranches.mockResolvedValue({
        branchStatus: 'ahead',
        aheadBy: 2,
        behindBy: 0,
        totalCommits: 5,
        save: false
      })

      const result = await prepareBranchAssessment(mockBranch, inputs)

      expect(result).toEqual({
        commitAge: 10,
        issueTitleString: 'Stale Branch: feature/test',
        lastCommitLogin: 'testuser',
        branchComparison: {
          branchStatus: 'ahead',
          aheadBy: 2,
          behindBy: 0,
          totalCommits: 5,
          save: false
        }
      })

      expect(mockGetRecentCommitAge).toHaveBeenCalledWith('abc123')
      expect(mockCreateIssueTitleString).toHaveBeenCalledWith('feature/test')
      expect(mockGetRecentCommitLogin).toHaveBeenCalledWith('abc123')
      expect(mockCompareBranches).toHaveBeenCalledWith('feature/test', 'off')
      expect(mockCore.startGroup).toHaveBeenCalled()
      expect(mockCore.info).toHaveBeenCalled()
    })

    it('should handle ignored commit messages', async () => {
      const inputs = { 
        ...mockValidInputs, 
        tagLastCommitter: false,
        ignoreCommitMessages: 'merge,revert',
        daysBeforeDelete: 14
      }
      
      mockGetRecentCommitAgeByNonIgnoredMessage.mockResolvedValue(8)
      mockCreateIssueTitleString.mockReturnValue('Stale Branch: feature/test')
      mockCompareBranches.mockResolvedValue({
        branchStatus: 'diverged',
        aheadBy: 1,
        behindBy: 3,
        totalCommits: 8,
        save: true
      })

      const result = await prepareBranchAssessment(mockBranch, inputs)

      expect(result).toEqual({
        commitAge: 8,
        issueTitleString: 'Stale Branch: feature/test',
        lastCommitLogin: 'Unknown',
        branchComparison: {
          branchStatus: 'diverged',
          aheadBy: 1,
          behindBy: 3,
          totalCommits: 8,
          save: true
        }
      })

      expect(mockGetRecentCommitAgeByNonIgnoredMessage).toHaveBeenCalledWith('abc123', ['merge', 'revert'], 14)
    })
  })
})
