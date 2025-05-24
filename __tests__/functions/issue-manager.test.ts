import * as core from '@actions/core'
import {
  closeIssueWithLogging,
  createStaleIssue,
  updateStaleIssue,
  processActiveBranchIssues,
  processStaleBranchIssues
} from '../../src/functions/issue-manager'
import {createIssue} from '../../src/functions/create-issue'
import {createIssueComment} from '../../src/functions/create-issue-comment'
import {closeIssue} from '../../src/functions/close-issue'
import {Inputs} from '../../src/types/inputs'
import {IssueResponse} from '../../src/types/issues'

// Mock dependencies
jest.mock('@actions/core')
jest.mock('../../src/functions/create-issue')
jest.mock('../../src/functions/create-issue-comment')
jest.mock('../../src/functions/close-issue')

const mockCore = core as jest.Mocked<typeof core>
const mockCreateIssue = createIssue as jest.MockedFunction<typeof createIssue>
const mockCreateIssueComment = createIssueComment as jest.MockedFunction<typeof createIssueComment>
const mockCloseIssue = closeIssue as jest.MockedFunction<typeof closeIssue>

describe('Issue Manager Functions', () => {
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

  describe('closeIssueWithLogging', () => {
    it('should close issue normally', async () => {
      mockCloseIssue.mockResolvedValue('Closed successfully')
      
      const result = await closeIssueWithLogging(123, mockValidInputs, 'test-branch')
      
      expect(result).toBe('Closed successfully')
      expect(mockCloseIssue).toHaveBeenCalledWith(123)
      expect(mockCore.info).not.toHaveBeenCalled()
    })

    it('should log dry run message', async () => {
      const inputs = { ...mockValidInputs, dryRun: true }
      
      const result = await closeIssueWithLogging(123, inputs, 'test-branch')
      
      expect(result).toBe('')
      expect(mockCloseIssue).not.toHaveBeenCalled()
      expect(mockCore.info).toHaveBeenCalledWith('Dry Run: Issue would be closed for branch: test-branch')
    })

    it('should log ignore interaction message', async () => {
      const inputs = { ...mockValidInputs, ignoreIssueInteraction: true }
      
      const result = await closeIssueWithLogging(123, inputs, 'test-branch')
      
      expect(result).toBe('')
      expect(mockCloseIssue).not.toHaveBeenCalled()
      expect(mockCore.info).toHaveBeenCalledWith('Ignoring issue interaction: Issue would be closed for branch: test-branch')
    })

    it('should prioritize dry run over ignore interaction', async () => {
      const inputs = { ...mockValidInputs, dryRun: true, ignoreIssueInteraction: true }
      
      const result = await closeIssueWithLogging(123, inputs, 'test-branch')
      
      expect(result).toBe('')
      expect(mockCloseIssue).not.toHaveBeenCalled()
      expect(mockCore.info).toHaveBeenCalledWith('Dry Run: Issue would be closed for branch: test-branch')
    })
  })

  describe('createStaleIssue', () => {
    it('should return early when no budget remaining', async () => {
      const result = await createStaleIssue('test-branch', 10, 'testuser', mockValidInputs, 0)
      
      expect(result).toEqual({ issueBudgetRemaining: 0, staleAdded: false })
      expect(mockCreateIssue).not.toHaveBeenCalled()
    })

    it('should create issue normally', async () => {
      const result = await createStaleIssue('test-branch', 10, 'testuser', mockValidInputs, 3)
      
      expect(result).toEqual({ issueBudgetRemaining: 2, staleAdded: true })
      expect(mockCreateIssue).toHaveBeenCalledWith(
        'test-branch',
        10,
        'testuser',
        14,
        'stale-branch',
        false
      )
      expect(mockCore.info).toHaveBeenCalled()
    })

    it('should log dry run message', async () => {
      const inputs = { ...mockValidInputs, dryRun: true }
      
      const result = await createStaleIssue('test-branch', 10, 'testuser', inputs, 3)
      
      expect(result).toEqual({ issueBudgetRemaining: 2, staleAdded: true })
      expect(mockCreateIssue).not.toHaveBeenCalled()
      expect(mockCore.info).toHaveBeenCalledWith('Dry Run: Issue would be created for branch: test-branch')
    })

    it('should log ignore interaction message', async () => {
      const inputs = { ...mockValidInputs, ignoreIssueInteraction: true }
      
      const result = await createStaleIssue('test-branch', 10, 'testuser', inputs, 3)
      
      expect(result).toEqual({ issueBudgetRemaining: 2, staleAdded: true })
      expect(mockCreateIssue).not.toHaveBeenCalled()
      expect(mockCore.info).toHaveBeenCalledWith('Ignoring issue interaction: Issue would be created for branch: test-branch')
    })

    it('should pass tagLastCommitter parameter correctly', async () => {
      const inputs = { ...mockValidInputs, tagLastCommitter: true }
      
      await createStaleIssue('test-branch', 10, 'testuser', inputs, 3)
      
      expect(mockCreateIssue).toHaveBeenCalledWith(
        'test-branch',
        10,
        'testuser',
        14,
        'stale-branch',
        true
      )
    })
  })

  describe('updateStaleIssue', () => {
    it('should update issue normally', async () => {
      await updateStaleIssue(123, 'test-branch', 10, 'testuser', mockValidInputs)
      
      expect(mockCreateIssueComment).toHaveBeenCalledWith(
        123,
        'test-branch',
        10,
        'testuser',
        false,
        14,
        'stale-branch',
        false
      )
    })

    it('should log dry run message', async () => {
      const inputs = { ...mockValidInputs, dryRun: true }
      
      await updateStaleIssue(123, 'test-branch', 10, 'testuser', inputs)
      
      expect(mockCreateIssueComment).not.toHaveBeenCalled()
      expect(mockCore.info).toHaveBeenCalledWith('Dry Run: Issue would be updated for branch: test-branch')
    })

    it('should log ignore interaction message', async () => {
      const inputs = { ...mockValidInputs, ignoreIssueInteraction: true }
      
      await updateStaleIssue(123, 'test-branch', 10, 'testuser', inputs)
      
      expect(mockCreateIssueComment).not.toHaveBeenCalled()
      expect(mockCore.info).toHaveBeenCalledWith('Ignoring issue interaction: Issue would be updated for branch: test-branch')
    })

    it('should pass all parameters correctly', async () => {
      const inputs = { 
        ...mockValidInputs, 
        commentUpdates: true, 
        tagLastCommitter: true 
      }
      
      await updateStaleIssue(123, 'test-branch', 10, 'testuser', inputs)
      
      expect(mockCreateIssueComment).toHaveBeenCalledWith(
        123,
        'test-branch',
        10,
        'testuser',
        true,
        14,
        'stale-branch',
        true
      )
    })
  })

  describe('processActiveBranchIssues', () => {
    const mockIssues: IssueResponse[] = [
      {
        issueNumber: 123,
        issueTitle: 'Stale Branch: test-branch'
      },
      {
        issueNumber: 124,
        issueTitle: 'Stale Branch: other-branch'
      }
    ]

    it('should close matching issue', async () => {
      mockCloseIssue.mockResolvedValue('Closed')
      
      await processActiveBranchIssues('test-branch', 'Stale Branch: test-branch', mockIssues, mockValidInputs)
      
      expect(mockCore.info).toHaveBeenCalled()
      expect(mockCloseIssue).toHaveBeenCalledWith(123)
    })

    it('should not close non-matching issues', async () => {
      await processActiveBranchIssues('test-branch', 'Stale Branch: different-branch', mockIssues, mockValidInputs)
      
      expect(mockCloseIssue).not.toHaveBeenCalled()
    })

    it('should handle multiple matching issues', async () => {
      const duplicateIssues: IssueResponse[] = [
        ...mockIssues,
        {
          issueNumber: 125,
          issueTitle: 'Stale Branch: test-branch'
        }
      ]
      mockCloseIssue.mockResolvedValue('Closed')
      
      await processActiveBranchIssues('test-branch', 'Stale Branch: test-branch', duplicateIssues, mockValidInputs)
      
      expect(mockCloseIssue).toHaveBeenCalledTimes(2)
      expect(mockCloseIssue).toHaveBeenCalledWith(123)
      expect(mockCloseIssue).toHaveBeenCalledWith(125)
    })

    it('should handle empty issues array', async () => {
      await processActiveBranchIssues('test-branch', 'Stale Branch: test-branch', [], mockValidInputs)
      
      expect(mockCloseIssue).not.toHaveBeenCalled()
    })
  })

  describe('processStaleBranchIssues', () => {
    const mockIssues: IssueResponse[] = [
      {
        issueNumber: 123,
        issueTitle: 'Stale Branch: existing-branch'
      }
    ]

    it('should create new issue when none exists', async () => {
      mockCreateIssue.mockResolvedValue(124)
      
      const result = await processStaleBranchIssues(
        'new-branch',
        'Stale Branch: new-branch',
        10,
        'testuser',
        mockIssues,
        mockValidInputs,
        3
      )
      
      expect(result).toEqual({ issueBudgetRemaining: 2, staleAdded: true })
      expect(mockCreateIssue).toHaveBeenCalled()
      expect(mockCreateIssueComment).not.toHaveBeenCalled()
    })

    it('should update existing issue', async () => {
      const result = await processStaleBranchIssues(
        'existing-branch',
        'Stale Branch: existing-branch',
        10,
        'testuser',
        mockIssues,
        mockValidInputs,
        3
      )
      
      expect(result).toEqual({ issueBudgetRemaining: 3, staleAdded: true })
      expect(mockCreateIssue).not.toHaveBeenCalled()
      expect(mockCreateIssueComment).toHaveBeenCalledWith(
        123,
        'existing-branch',
        10,
        'testuser',
        false,
        14,
        'stale-branch',
        false
      )
    })

    it('should not create issue when budget is zero', async () => {
      const result = await processStaleBranchIssues(
        'new-branch',
        'Stale Branch: new-branch',
        10,
        'testuser',
        mockIssues,
        mockValidInputs,
        0
      )
      
      expect(result).toEqual({ issueBudgetRemaining: 0, staleAdded: false })
      expect(mockCreateIssue).not.toHaveBeenCalled()
    })
  })
})
