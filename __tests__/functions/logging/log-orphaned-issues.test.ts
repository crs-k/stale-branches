import {logOrphanedIssues} from '../../../src/functions/logging/log-orphaned-issues'
import styles from 'ansi-styles'

describe('logOrphanedIssues', () => {
  it('returns formatted message for single orphaned issue', () => {
    const orphanCount = 1
    const result = logOrphanedIssues(orphanCount)
    const expected = `${styles.bold.open}[${styles.magenta.open}${orphanCount}${styles.magenta.close}] ${styles.blueBright.open}orphaned issues found${styles.blueBright.close}.${styles.bold.close}`
    
    expect(result).toBe(expected)
  })

  it('returns formatted message for multiple orphaned issues', () => {
    const orphanCount = 5
    const result = logOrphanedIssues(orphanCount)
    const expected = `${styles.bold.open}[${styles.magenta.open}${orphanCount}${styles.magenta.close}] ${styles.blueBright.open}orphaned issues found${styles.blueBright.close}.${styles.bold.close}`
    
    expect(result).toBe(expected)
  })

  it('returns formatted message for zero orphaned issues', () => {
    const orphanCount = 0
    const result = logOrphanedIssues(orphanCount)
    const expected = `${styles.bold.open}[${styles.magenta.open}${orphanCount}${styles.magenta.close}] ${styles.blueBright.open}orphaned issues found${styles.blueBright.close}.${styles.bold.close}`
    
    expect(result).toBe(expected)
  })
})