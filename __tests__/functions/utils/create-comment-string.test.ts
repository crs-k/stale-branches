import {createCommentString} from '../../../src/functions/utils/create-comment-string'

describe('createCommentString', () => {
  const branch = 'feature-branch'
  const lastCommitter = 'octocat'
  const commitAge = 30
  const daysBeforeDelete = 60
  
  beforeEach(() => {
    // Mock Date to have consistent test results
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2025-01-01T00:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('creates comment string with tag when tagLastCommitter is true', () => {
    const result = createCommentString(branch, lastCommitter, commitAge, daysBeforeDelete, true)
    
    expect(result).toContain(`@${lastCommitter}`)
    expect(result).toContain(`${branch} has had no activity for ${commitAge} days`)
    expect(result).toContain(`This branch will be automatically deleted in ${daysBeforeDelete - commitAge} days`)
    expect(result).toContain('This issue was last updated on')
    expect(result).not.toContain('Note: Ignored')
  })

  it('creates comment string without tag when tagLastCommitter is false', () => {
    const result = createCommentString(branch, lastCommitter, commitAge, daysBeforeDelete, false)
    
    expect(result).not.toContain(`@${lastCommitter}`)
    expect(result).toContain(`${branch} has had no activity for ${commitAge} days`)
    expect(result).toContain(`This branch will be automatically deleted in ${daysBeforeDelete - commitAge} days`)
    expect(result).toContain('This issue was last updated on')
    expect(result).not.toContain('Note: Ignored')
  })

  it('includes note about ignored commits when ignoredCommitInfo is provided with single commit', () => {
    const ignoredCommitInfo = { ignoredCount: 1, usedFallback: false }
    const result = createCommentString(branch, lastCommitter, commitAge, daysBeforeDelete, true, ignoredCommitInfo)
    
    expect(result).toContain('Note: Ignored 1 commit matching filter')
    expect(result).not.toContain('used fallback')
  })

  it('includes note about ignored commits when ignoredCommitInfo is provided with multiple commits', () => {
    const ignoredCommitInfo = { ignoredCount: 3, usedFallback: false }
    const result = createCommentString(branch, lastCommitter, commitAge, daysBeforeDelete, true, ignoredCommitInfo)
    
    expect(result).toContain('Note: Ignored 3 commits matching filter')
    expect(result).not.toContain('used fallback')
  })

  it('includes note about fallback when usedFallback is true', () => {
    const ignoredCommitInfo = { ignoredCount: 2, usedFallback: true }
    const result = createCommentString(branch, lastCommitter, commitAge, daysBeforeDelete, false, ignoredCommitInfo)
    
    expect(result).toContain('Note: Ignored 2 commits matching filter, used fallback')
  })

  it('handles case when daysUntilDelete is zero', () => {
    const result = createCommentString(branch, lastCommitter, daysBeforeDelete, daysBeforeDelete, true)
    
    expect(result).toContain('This branch will be automatically deleted in 0 days')
  })

  it('handles case when daysUntilDelete would be negative', () => {
    const result = createCommentString(branch, lastCommitter, daysBeforeDelete + 10, daysBeforeDelete, true)
    
    expect(result).toContain('This branch will be automatically deleted in 0 days')
  })
})
