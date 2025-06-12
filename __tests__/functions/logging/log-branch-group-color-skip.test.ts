import {logBranchGroupColorSkip} from '../../../src/functions/logging/log-branch-group-color-skip'
import styles from 'ansi-styles'

describe('logBranchGroupColorSkip', () => {
  it('returns formatted branch name with blue color', () => {
    const branchName = 'feature/test-branch'
    const result = logBranchGroupColorSkip(branchName)
    const expected = `[${styles.blueBright.open}${branchName}${styles.blueBright.close}]`
    
    expect(result).toBe(expected)
  })

  it('handles empty branch name', () => {
    const branchName = ''
    const result = logBranchGroupColorSkip(branchName)
    const expected = `[${styles.blueBright.open}${branchName}${styles.blueBright.close}]`
    
    expect(result).toBe(expected)
  })

  it('handles special characters in branch name', () => {
    const branchName = 'feature/test-branch_with-special.chars'
    const result = logBranchGroupColorSkip(branchName)
    const expected = `[${styles.blueBright.open}${branchName}${styles.blueBright.close}]`
    
    expect(result).toBe(expected)
  })
})