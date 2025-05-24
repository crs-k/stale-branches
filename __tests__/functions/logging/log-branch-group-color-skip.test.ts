import {logBranchGroupColorSkip} from '../../../src/functions/logging/log-branch-group-color-skip'
import styles from 'ansi-styles'

// Mock ansi-styles
jest.mock('ansi-styles', () => ({
  blueBright: {
    open: '[BLUE_BRIGHT]',
    close: '[/BLUE_BRIGHT]'
  }
}))

describe('logBranchGroupColorSkip', () => {
  it('formats branch name with blue bright color', () => {
    const result = logBranchGroupColorSkip('feature-branch')
    expect(result).toBe(`[${styles.blueBright.open}feature-branch${styles.blueBright.close}]`)
  })

  it('handles branch names with special characters', () => {
    const result = logBranchGroupColorSkip('feature/branch-name_123')
    expect(result).toBe(`[${styles.blueBright.open}feature/branch-name_123${styles.blueBright.close}]`)
  })

  it('handles empty branch name', () => {
    const result = logBranchGroupColorSkip('')
    expect(result).toBe(`[${styles.blueBright.open}${styles.blueBright.close}]`)
  })
})
