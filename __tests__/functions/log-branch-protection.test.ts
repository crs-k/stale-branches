import {logBranchProtection} from '../../src/functions/logging/log-branch-protection'
import styles from 'ansi-styles'

describe('logBranchProtection', () => {
  it('returns yellow bold message for protected and included', () => {
    const result = logBranchProtection(true, true)
    expect(result).toContain(styles.bold.open)
    expect(result).toContain(styles.yellowBright.open)
    expect(result).toContain('protected branch: true')
    expect(result).toContain('(included)')
    expect(result).toContain(styles.bold.close)
  })

  it('returns red bold message for protected and skipped', () => {
    const result = logBranchProtection(true, false)
    expect(result).toContain(styles.bold.open)
    expect(result).toContain(styles.redBright.open)
    expect(result).toContain('protected branch: true')
    expect(result).toContain('(skipped)')
    expect(result).toContain(styles.bold.close)
  })

  it('returns empty string for unprotected', () => {
    const result = logBranchProtection(false, false)
    expect(result).toBe('')
  })
})
