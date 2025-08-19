import {logBranchProtection} from '../../src/functions/logging/log-branch-protection'
import styles from 'ansi-styles'

describe('logBranchProtection', () => {
  it('returns yellow bold message for protected and included', () => {
    const result = logBranchProtection(true, true, 'branch protection', 'feature')
    expect(result).toContain(styles.bold.open)
    expect(result).toContain(styles.yellowBright.open)
    expect(result).toContain('protected branch: true')
    expect(result).toContain('(branch protection)')
    expect(result).toContain('(included)')
    expect(result).toContain(styles.bold.close)
  })

  it('returns red bold message for protected and skipped', () => {
    const result = logBranchProtection(true, false, 'ruleset', 'main')
    expect(result).toContain(styles.bold.open)
    expect(result).toContain(styles.redBright.open)
    expect(result).toContain('protected branch: true')
    expect(result).toContain('(ruleset)')
    expect(result).toContain('(skipped)')
    expect(result).toContain(styles.bold.close)
  })

  it('returns green bold message for unprotected (new behavior)', () => {
    const result = logBranchProtection(false, false, '', 'feature')
    expect(result).toContain(styles.bold.open)
    expect(result).toContain(styles.greenBright.open)
    expect(result).toContain('protected branch: false')
    expect(result).toContain('(processing)')
    expect(result).toContain(styles.bold.close)
  })

  it('includes protection type when provided', () => {
    const result = logBranchProtection(true, true, 'default branch', 'main')
    expect(result).toContain('(default branch)')
  })

  it('handles multiple protection types', () => {
    const result = logBranchProtection(true, false, 'branch protection and ruleset', 'feature')
    expect(result).toContain('(branch protection and ruleset)')
  })

  it('works without optional parameters', () => {
    const result = logBranchProtection(true, true)
    expect(result).toContain('protected branch: true')
    expect(result).toContain('(included)')
    expect(result).not.toContain('(undefined)')
  })
})
