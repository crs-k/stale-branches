import {createCommentString} from '../../../src/functions/utils/create-comment-string'

describe('Create Comment String Function', () => {
  const branch = 'test-branch'
  const lastCommitter = 'testuser'
  const commitAge = 15
  const daysBeforeDelete = 180

  test('creates comment string with tag last committer enabled', () => {
    const result = createCommentString(branch, lastCommitter, commitAge, daysBeforeDelete, true)
    
    expect(result).toContain(`@${lastCommitter}`)
    expect(result).toContain(`${branch} has had no activity for ${commitAge.toString()} days`)
    expect(result).toContain(`This branch will be automatically deleted in ${(daysBeforeDelete - commitAge).toString()} days`)
    expect(result).toContain('This issue was last updated on')
  })

  test('creates comment string with tag last committer disabled', () => {
    const result = createCommentString(branch, lastCommitter, commitAge, daysBeforeDelete, false)
    
    expect(result).not.toContain(`@${lastCommitter}`)
    expect(result).toContain(`${branch} has had no activity for ${commitAge.toString()} days`)
    expect(result).toContain(`This branch will be automatically deleted in ${(daysBeforeDelete - commitAge).toString()} days`)
    expect(result).toContain('This issue was last updated on')
  })

  test('creates comment string with ignored commit info - single commit', () => {
    const ignoredCommitInfo = {
      ignoredCount: 1,
      usedFallback: false
    }

    const result = createCommentString(branch, lastCommitter, commitAge, daysBeforeDelete, true, ignoredCommitInfo)
    
    expect(result).toContain('_Note: Ignored 1 commit matching filter._')
    expect(result).not.toContain('used fallback')
  })

  test('creates comment string with ignored commit info - multiple commits', () => {
    const ignoredCommitInfo = {
      ignoredCount: 3,
      usedFallback: false
    }

    const result = createCommentString(branch, lastCommitter, commitAge, daysBeforeDelete, true, ignoredCommitInfo)
    
    expect(result).toContain('_Note: Ignored 3 commits matching filter._')
    expect(result).not.toContain('used fallback')
  })

  test('creates comment string with ignored commit info and fallback used', () => {
    const ignoredCommitInfo = {
      ignoredCount: 2,
      usedFallback: true
    }

    const result = createCommentString(branch, lastCommitter, commitAge, daysBeforeDelete, true, ignoredCommitInfo)
    
    expect(result).toContain('_Note: Ignored 2 commits matching filter, used days-before-delete fallback._')
  })

  test('creates comment string without ignored commit info when count is 0', () => {
    const ignoredCommitInfo = {
      ignoredCount: 0,
      usedFallback: false
    }

    const result = createCommentString(branch, lastCommitter, commitAge, daysBeforeDelete, true, ignoredCommitInfo)
    
    expect(result).not.toContain('_Note: Ignored')
  })

  test('calculates days until delete correctly when commit age exceeds days before delete', () => {
    const highCommitAge = 200 // Greater than daysBeforeDelete
    
    const result = createCommentString(branch, lastCommitter, highCommitAge, daysBeforeDelete, true)
    
    expect(result).toContain('This branch will be automatically deleted in 0 days')
  })
})