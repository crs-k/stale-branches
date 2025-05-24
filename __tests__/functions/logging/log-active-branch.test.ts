import {logActiveBranch} from '../../../src/functions/logging/log-active-branch'
import styles from 'ansi-styles'

// Mock ansi-styles
jest.mock('ansi-styles', () => ({
  green: {
    open: '[GREEN]',
    close: '[/GREEN]'
  }
}))

describe('logActiveBranch', () => {
  it('formats branch name with green color', () => {
    const result = logActiveBranch('feature-branch')
    expect(result).toBe(`[${styles.green.open}feature-branch${styles.green.close}] has become active again.`)
  })

  it('handles branch names with special characters', () => {
    const result = logActiveBranch('feature/branch-name_123')
    expect(result).toBe(`[${styles.green.open}feature/branch-name_123${styles.green.close}] has become active again.`)
  })

  it('handles empty branch name', () => {
    const result = logActiveBranch('')
    expect(result).toBe(`[${styles.green.open}${styles.green.close}] has become active again.`)
  })
})
