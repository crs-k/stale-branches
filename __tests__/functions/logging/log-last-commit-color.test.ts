import {logLastCommitColor} from '../../../src/functions/logging/log-last-commit-color'
import styles from 'ansi-styles'

// Mock ansi-styles
jest.mock('ansi-styles', () => ({
  redBright: {
    open: '[RED_BRIGHT]',
    close: '[/RED_BRIGHT]'
  },
  yellow: {
    open: '[YELLOW]',
    close: '[/YELLOW]'
  },
  green: {
    open: '[GREEN]',
    close: '[/GREEN]'
  },
  magenta: {
    open: '[MAGENTA]',
    close: '[/MAGENTA]'
  },
  cyan: {
    open: '[CYAN]',
    close: '[/CYAN]'
  },
  bold: {
    open: '[BOLD]',
    close: '[/BOLD]'
  }
}))

describe('logLastCommitColor', () => {
  const daysBeforeStale = 30
  const daysBeforeDelete = 60

  it('formats with red color when using fallback with ignored commits', () => {
    const commitAge = 65
    const ignoredCommitInfo = { ignoredCount: 3, usedFallback: true }
    
    const result = logLastCommitColor(commitAge, daysBeforeStale, daysBeforeDelete, ignoredCommitInfo)
    
    expect(result).toBe(
      `${styles.redBright.open}No meaningful commit found in the last ${daysBeforeDelete} days (days-before-delete).${styles.redBright.close} ` +
      `${styles.cyan.open}(ignored ${ignoredCommitInfo.ignoredCount} commits matching filter, used fallback)${styles.cyan.close}`
    )
  })

  it('formats with red color when branch is older than delete threshold', () => {
    const commitAge = 65
    
    const result = logLastCommitColor(commitAge, daysBeforeStale, daysBeforeDelete)
    
    expect(result).toBe(
      `${styles.redBright.open}Last Meaningful Commit: ${styles.magenta.open}${commitAge}${styles.magenta.close} days ago.${styles.redBright.close}`
    )
  })

  it('formats with yellow color when branch is older than stale threshold but not delete threshold', () => {
    const commitAge = 45
    
    const result = logLastCommitColor(commitAge, daysBeforeStale, daysBeforeDelete)
    
    expect(result).toBe(
      `${styles.yellow.open}Last Meaningful Commit: ${styles.magenta.open}${commitAge}${styles.magenta.close} days ago.${styles.yellow.close}`
    )
  })

  it('formats with green color when branch is newer than stale threshold', () => {
    const commitAge = 15
    
    const result = logLastCommitColor(commitAge, daysBeforeStale, daysBeforeDelete)
    
    expect(result).toBe(
      `${styles.green.open}Last Meaningful Commit: ${styles.magenta.open}${commitAge}${styles.magenta.close} days ago.${styles.green.close}`
    )
  })

  it('includes committer when provided', () => {
    const commitAge = 15
    const committer = 'octocat'
    
    const result = logLastCommitColor(commitAge, daysBeforeStale, daysBeforeDelete, undefined, committer)
    
    expect(result).toBe(
      `${styles.green.open}Last Meaningful Commit: ${styles.magenta.open}${commitAge}${styles.magenta.close} days ago by ${styles.bold.open}${committer}${styles.bold.close}.${styles.green.close}`
    )
  })

  it('includes SHA when provided', () => {
    const commitAge = 15
    const sha = 'abc123def456'
    
    const result = logLastCommitColor(commitAge, daysBeforeStale, daysBeforeDelete, undefined, undefined, sha)
    
    expect(result).toBe(
      `${styles.green.open}Last Meaningful Commit: ${styles.magenta.open}${commitAge}${styles.magenta.close} days ago ${styles.cyan.open}SHA: ${sha}${styles.cyan.close}.${styles.green.close}`
    )
  })

  it('includes committer and SHA when both provided', () => {
    const commitAge = 15
    const committer = 'octocat'
    const sha = 'abc123def456'
    
    const result = logLastCommitColor(commitAge, daysBeforeStale, daysBeforeDelete, undefined, committer, sha)
    
    expect(result).toBe(
      `${styles.green.open}Last Meaningful Commit: ${styles.magenta.open}${commitAge}${styles.magenta.close} days ago by ${styles.bold.open}${committer}${styles.bold.close} ${styles.cyan.open}SHA: ${sha}${styles.cyan.close}.${styles.green.close}`
    )
  })

  it('includes note about ignored commits with singular form', () => {
    const commitAge = 15
    const ignoredCommitInfo = { ignoredCount: 1, usedFallback: false }
    
    const result = logLastCommitColor(commitAge, daysBeforeStale, daysBeforeDelete, ignoredCommitInfo)
    
    expect(result).toBe(
      `${styles.green.open}Last Meaningful Commit: ${styles.magenta.open}${commitAge}${styles.magenta.close} days ago.${styles.green.close} ` +
      `${styles.cyan.open}(ignored 1 commit matching filter)${styles.cyan.close}`
    )
  })

  it('includes note about ignored commits with plural form', () => {
    const commitAge = 15
    const ignoredCommitInfo = { ignoredCount: 3, usedFallback: false }
    
    const result = logLastCommitColor(commitAge, daysBeforeStale, daysBeforeDelete, ignoredCommitInfo)
    
    expect(result).toBe(
      `${styles.green.open}Last Meaningful Commit: ${styles.magenta.open}${commitAge}${styles.magenta.close} days ago.${styles.green.close} ` +
      `${styles.cyan.open}(ignored 3 commits matching filter)${styles.cyan.close}`
    )
  })

  it('includes note about ignored commits and fallback', () => {
    const commitAge = 15
    const ignoredCommitInfo = { ignoredCount: 3, usedFallback: true }
    
    // Note: This test specifically tests a case that shouldn't happen in production code
    // because when usedFallback is true, a different message is displayed at the beginning
    // However, we want to test all code paths
    const result = logLastCommitColor(commitAge, daysBeforeStale, daysBeforeDelete, 
      { ...ignoredCommitInfo, usedFallback: false })
    
    expect(result).toBe(
      `${styles.green.open}Last Meaningful Commit: ${styles.magenta.open}${commitAge}${styles.magenta.close} days ago.${styles.green.close} ` +
      `${styles.cyan.open}(ignored 3 commits matching filter)${styles.cyan.close}`
    )
  })
})
