import {logOrphanedIssues} from '../../../src/functions/logging/log-orphaned-issues'
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
  },
  blueBright: {
    open: '[BLUE_BRIGHT]',
    close: '[/BLUE_BRIGHT]'
  }
}))

describe('logOrphanedIssues', () => {
  it('formats orphaned issues count with proper colors', () => {
    const result = logOrphanedIssues(5)
    expect(result).toBe(`${styles.bold.open}[${styles.magenta.open}5${styles.magenta.close}] ${styles.blueBright.open}orphaned issues found${styles.blueBright.close}.${styles.bold.close}`)
  })

  it('handles zero orphaned issues', () => {
    const result = logOrphanedIssues(0)
    expect(result).toBe(`${styles.bold.open}[${styles.magenta.open}0${styles.magenta.close}] ${styles.blueBright.open}orphaned issues found${styles.blueBright.close}.${styles.bold.close}`)
  })

  it('handles large number of orphaned issues', () => {
    const result = logOrphanedIssues(100)
    expect(result).toBe(`${styles.bold.open}[${styles.magenta.open}100${styles.magenta.close}] ${styles.blueBright.open}orphaned issues found${styles.blueBright.close}.${styles.bold.close}`)
  })
})
