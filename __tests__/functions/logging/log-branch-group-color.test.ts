import {logBranchGroupColor} from '../../../src/functions/logging/log-branch-group-color'
import styles from 'ansi-styles'

// Mock ansi-styles
jest.mock('ansi-styles', () => ({
  redBright: {
    open: '[RED_BRIGHT]',
    close: '[/RED_BRIGHT]'
  },
  yellowBright: {
    open: '[YELLOW_BRIGHT]',
    close: '[/YELLOW_BRIGHT]'
  },
  greenBright: {
    open: '[GREEN_BRIGHT]',
    close: '[/GREEN_BRIGHT]'
  }
}))

describe('logBranchGroupColor', () => {
  const branchName = 'feature-branch'
  const daysBeforeStale = 30
  const daysBeforeDelete = 60

  it('formats with red color when branch is older than delete threshold', () => {
    const commitAge = 65 // Older than daysBeforeDelete
    const result = logBranchGroupColor(branchName, commitAge, daysBeforeStale, daysBeforeDelete)
    expect(result).toBe(`[${styles.redBright.open}${branchName}${styles.redBright.close}]`)
  })

  it('formats with yellow color when branch is older than stale threshold but not delete threshold', () => {
    const commitAge = 45 // Between daysBeforeStale and daysBeforeDelete
    const result = logBranchGroupColor(branchName, commitAge, daysBeforeStale, daysBeforeDelete)
    expect(result).toBe(`[${styles.yellowBright.open}${branchName}${styles.yellowBright.close}]`)
  })

  it('formats with green color when branch is newer than stale threshold', () => {
    const commitAge = 15 // Less than daysBeforeStale
    const result = logBranchGroupColor(branchName, commitAge, daysBeforeStale, daysBeforeDelete)
    expect(result).toBe(`[${styles.greenBright.open}${branchName}${styles.greenBright.close}]`)
  })

  it('formats with green color when commitAge equals daysBeforeStale', () => {
    const commitAge = 30 // Equal to daysBeforeStale
    const result = logBranchGroupColor(branchName, commitAge, daysBeforeStale, daysBeforeDelete)
    // The current implementation will use green color when commitAge = daysBeforeStale
    expect(result).toBe(`[${styles.greenBright.open}${branchName}${styles.greenBright.close}]`)
  })

  it('formats with yellow color when commitAge equals daysBeforeDelete', () => {
    const commitAge = 60 // Equal to daysBeforeDelete
    const result = logBranchGroupColor(branchName, commitAge, daysBeforeStale, daysBeforeDelete)
    // The current implementation will use yellow color when commitAge = daysBeforeDelete
    expect(result).toBe(`[${styles.yellowBright.open}${branchName}${styles.yellowBright.close}]`)
  })
})
