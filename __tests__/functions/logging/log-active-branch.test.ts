import {logActiveBranch} from '../../../src/functions/logging/log-active-branch'
import styles from 'ansi-styles'

describe('logActiveBranch', () => {
  it('returns formatted message for active branch', () => {
    const branchName = 'feature/test-branch'
    const result = logActiveBranch(branchName)
    const expected = `[${styles.green.open}${branchName}${styles.green.close}] has become active again.`
    
    expect(result).toBe(expected)
  })

  it('handles empty branch name', () => {
    const branchName = ''
    const result = logActiveBranch(branchName)
    const expected = `[${styles.green.open}${branchName}${styles.green.close}] has become active again.`
    
    expect(result).toBe(expected)
  })

  it('handles branch name with special characters', () => {
    const branchName = 'feature/test-branch_with-special.chars'
    const result = logActiveBranch(branchName)
    const expected = `[${styles.green.open}${branchName}${styles.green.close}] has become active again.`
    
    expect(result).toBe(expected)
  })
})