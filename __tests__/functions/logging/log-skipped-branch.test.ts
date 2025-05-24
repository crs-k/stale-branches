import {logSkippedBranch} from '../../../src/functions/logging/log-skipped-branch'
import styles from 'ansi-styles'

// Mock ansi-styles
jest.mock('ansi-styles', () => ({
  bold: {
    open: '[BOLD]',
    close: '[/BOLD]'
  },
  magenta: {
    open: '[MAGENTA]',
    close: '[/MAGENTA]'
  }
}))

describe('logSkippedBranch', () => {
  it('formats skipped branch message with proper colors and singular PR', () => {
    const branchName = 'feature-branch'
    const activePrs = 1
    
    const result = logSkippedBranch(branchName, activePrs)
    
    expect(result).toBe(
      `${styles.bold.open}${branchName}${styles.bold.close} was skipped due to ` +
      `${styles.magenta.open}${activePrs}${styles.magenta.close} active pull request(s).`
    )
  })

  it('formats skipped branch message with proper colors and multiple PRs', () => {
    const branchName = 'feature-branch'
    const activePrs = 5
    
    const result = logSkippedBranch(branchName, activePrs)
    
    expect(result).toBe(
      `${styles.bold.open}${branchName}${styles.bold.close} was skipped due to ` +
      `${styles.magenta.open}${activePrs}${styles.magenta.close} active pull request(s).`
    )
  })

  it('handles branch names with special characters', () => {
    const branchName = 'feature/branch-name_123'
    const activePrs = 1
    
    const result = logSkippedBranch(branchName, activePrs)
    
    expect(result).toBe(
      `${styles.bold.open}${branchName}${styles.bold.close} was skipped due to ` +
      `${styles.magenta.open}${activePrs}${styles.magenta.close} active pull request(s).`
    )
  })
})
