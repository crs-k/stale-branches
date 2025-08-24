import {logLastCommitColor} from '../../../src/functions/logging/log-last-commit-color'
import styles from 'ansi-styles'

describe('logLastCommitColor', () => {
  it('returns fallback message when ignoredCommitInfo.usedFallback is true', () => {
    const commitAge = 10
    const daysBeforeStale = 5
    const daysBeforeDelete = 15
    const ignoredCommitInfo = { ignoredCount: 3, usedFallback: true }
    
    const result = logLastCommitColor(commitAge, daysBeforeStale, daysBeforeDelete, ignoredCommitInfo)
    const expected = `${styles.redBright.open}No meaningful commit found in the last ${daysBeforeDelete} days (days-before-delete).${styles.redBright.close} ${styles.cyan.open}(ignored ${ignoredCommitInfo.ignoredCount} commits matching filter, used days-before-delete fallback)${styles.cyan.close}`
    
    expect(result).toBe(expected)
  })

  it('returns fallback message with single commit when ignoredCommitInfo.usedFallback is true', () => {
    const commitAge = 10
    const daysBeforeStale = 5
    const daysBeforeDelete = 15
    const ignoredCommitInfo = { ignoredCount: 1, usedFallback: true }
    
    const result = logLastCommitColor(commitAge, daysBeforeStale, daysBeforeDelete, ignoredCommitInfo)
    const expected = `${styles.redBright.open}No meaningful commit found in the last ${daysBeforeDelete} days (days-before-delete).${styles.redBright.close} ${styles.cyan.open}(ignored ${ignoredCommitInfo.ignoredCount} commit matching filter, used days-before-delete fallback)${styles.cyan.close}`
    
    expect(result).toBe(expected)
  })

  it('returns green commit color when commit age is less than days before stale', () => {
    const commitAge = 3
    const daysBeforeStale = 5
    const daysBeforeDelete = 15
    
    const result = logLastCommitColor(commitAge, daysBeforeStale, daysBeforeDelete)
    const expected = `${styles.green.open}Last Meaningful Commit: ${styles.magenta.open}${commitAge.toString()}${styles.magenta.close} days ago.${styles.green.close}`
    
    expect(result).toBe(expected)
  })

  it('returns yellow commit color when commit age is greater than days before stale but less than days before delete', () => {
    const commitAge = 8
    const daysBeforeStale = 5
    const daysBeforeDelete = 15
    
    const result = logLastCommitColor(commitAge, daysBeforeStale, daysBeforeDelete)
    const expected = `${styles.yellow.open}Last Meaningful Commit: ${styles.magenta.open}${commitAge.toString()}${styles.magenta.close} days ago.${styles.yellow.close}`
    
    expect(result).toBe(expected)
  })

  it('returns red commit color when commit age is greater than days before delete', () => {
    const commitAge = 20
    const daysBeforeStale = 5
    const daysBeforeDelete = 15
    
    const result = logLastCommitColor(commitAge, daysBeforeStale, daysBeforeDelete)
    const expected = `${styles.redBright.open}Last Meaningful Commit: ${styles.magenta.open}${commitAge.toString()}${styles.magenta.close} days ago.${styles.redBright.close}`
    
    expect(result).toBe(expected)
  })

  it('includes committer name when provided', () => {
    const commitAge = 3
    const daysBeforeStale = 5
    const daysBeforeDelete = 15
    const committer = 'John Doe'
    
    const result = logLastCommitColor(commitAge, daysBeforeStale, daysBeforeDelete, undefined, committer)
    const expected = `${styles.green.open}Last Meaningful Commit: ${styles.magenta.open}${commitAge.toString()}${styles.magenta.close} days ago by ${styles.bold.open}${committer}${styles.bold.close}.${styles.green.close}`
    
    expect(result).toBe(expected)
  })

  it('includes SHA when provided', () => {
    const commitAge = 3
    const daysBeforeStale = 5
    const daysBeforeDelete = 15
    const sha = 'abc123def456'
    
    const result = logLastCommitColor(commitAge, daysBeforeStale, daysBeforeDelete, undefined, undefined, sha)
    const expected = `${styles.green.open}Last Meaningful Commit: ${styles.magenta.open}${commitAge.toString()}${styles.magenta.close} days ago ${styles.cyan.open}SHA: ${sha}${styles.cyan.close}.${styles.green.close}`
    
    expect(result).toBe(expected)
  })

  it('includes both committer and SHA when provided', () => {
    const commitAge = 3
    const daysBeforeStale = 5
    const daysBeforeDelete = 15
    const committer = 'John Doe'
    const sha = 'abc123def456'
    
    const result = logLastCommitColor(commitAge, daysBeforeStale, daysBeforeDelete, undefined, committer, sha)
    const expected = `${styles.green.open}Last Meaningful Commit: ${styles.magenta.open}${commitAge.toString()}${styles.magenta.close} days ago by ${styles.bold.open}${committer}${styles.bold.close} ${styles.cyan.open}SHA: ${sha}${styles.cyan.close}.${styles.green.close}`
    
    expect(result).toBe(expected)
  })

  it('includes ignored commit info with single commit when ignoredCommitInfo is provided but not fallback', () => {
    const commitAge = 3
    const daysBeforeStale = 5
    const daysBeforeDelete = 15
    const ignoredCommitInfo = { ignoredCount: 1, usedFallback: false }
    
    const result = logLastCommitColor(commitAge, daysBeforeStale, daysBeforeDelete, ignoredCommitInfo)
    const expected = `${styles.green.open}Last Meaningful Commit: ${styles.magenta.open}${commitAge.toString()}${styles.magenta.close} days ago.${styles.green.close} ${styles.cyan.open}(ignored ${ignoredCommitInfo.ignoredCount} commit matching filter)${styles.cyan.close}`
    
    expect(result).toBe(expected)
  })

  it('includes ignored commit info with multiple commits when ignoredCommitInfo is provided but not fallback', () => {
    const commitAge = 3
    const daysBeforeStale = 5
    const daysBeforeDelete = 15
    const ignoredCommitInfo = { ignoredCount: 3, usedFallback: false }
    
    const result = logLastCommitColor(commitAge, daysBeforeStale, daysBeforeDelete, ignoredCommitInfo)
    const expected = `${styles.green.open}Last Meaningful Commit: ${styles.magenta.open}${commitAge.toString()}${styles.magenta.close} days ago.${styles.green.close} ${styles.cyan.open}(ignored ${ignoredCommitInfo.ignoredCount} commits matching filter)${styles.cyan.close}`
    
    expect(result).toBe(expected)
  })

  it('does not include ignored commit info when ignoredCount is 0', () => {
    const commitAge = 3
    const daysBeforeStale = 5
    const daysBeforeDelete = 15
    const ignoredCommitInfo = { ignoredCount: 0, usedFallback: false }
    
    const result = logLastCommitColor(commitAge, daysBeforeStale, daysBeforeDelete, ignoredCommitInfo)
    const expected = `${styles.green.open}Last Meaningful Commit: ${styles.magenta.open}${commitAge.toString()}${styles.magenta.close} days ago.${styles.green.close}`
    
    expect(result).toBe(expected)
  })
})