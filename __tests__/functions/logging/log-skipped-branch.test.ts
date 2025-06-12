import {logSkippedBranch} from '../../../src/functions/logging/log-skipped-branch'
import styles from 'ansi-styles'

describe('logSkippedBranch', () => {
  it('returns formatted message for skipped branch with single PR', () => {
    const branchName = 'feature/test-branch'
    const activePrs = 1
    const result = logSkippedBranch(branchName, activePrs)
    const expected = `${styles.bold.open}${branchName}${styles.bold.close} was skipped due to ${styles.magenta.open}${activePrs}${styles.magenta.close} active pull request(s).`
    
    expect(result).toBe(expected)
  })

  it('returns formatted message for skipped branch with multiple PRs', () => {
    const branchName = 'feature/another-branch'
    const activePrs = 3
    const result = logSkippedBranch(branchName, activePrs)
    const expected = `${styles.bold.open}${branchName}${styles.bold.close} was skipped due to ${styles.magenta.open}${activePrs}${styles.magenta.close} active pull request(s).`
    
    expect(result).toBe(expected)
  })

  it('handles branch with special characters', () => {
    const branchName = 'feature/test-branch_with-special.chars'
    const activePrs = 2
    const result = logSkippedBranch(branchName, activePrs)
    const expected = `${styles.bold.open}${branchName}${styles.bold.close} was skipped due to ${styles.magenta.open}${activePrs}${styles.magenta.close} active pull request(s).`
    
    expect(result).toBe(expected)
  })

  it('handles zero active PRs', () => {
    const branchName = 'feature/test-branch'
    const activePrs = 0
    const result = logSkippedBranch(branchName, activePrs)
    const expected = `${styles.bold.open}${branchName}${styles.bold.close} was skipped due to ${styles.magenta.open}${activePrs}${styles.magenta.close} active pull request(s).`
    
    expect(result).toBe(expected)
  })
})