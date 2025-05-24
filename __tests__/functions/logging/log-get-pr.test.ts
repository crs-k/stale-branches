import {logGetPr} from '../../../src/functions/logging/log-get-pr'
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

describe('logGetPr', () => {
  it('formats PR count with proper colors', () => {
    const result = logGetPr(5)
    expect(result).toBe(`${styles.bold.open}[${styles.magenta.open}5${styles.magenta.close}] ${styles.blueBright.open}pull requests found${styles.blueBright.close}.${styles.bold.close}`)
  })

  it('handles zero PRs', () => {
    const result = logGetPr(0)
    expect(result).toBe(`${styles.bold.open}[${styles.magenta.open}0${styles.magenta.close}] ${styles.blueBright.open}pull requests found${styles.blueBright.close}.${styles.bold.close}`)
  })

  it('handles large number of PRs', () => {
    const result = logGetPr(100)
    expect(result).toBe(`${styles.bold.open}[${styles.magenta.open}100${styles.magenta.close}] ${styles.blueBright.open}pull requests found${styles.blueBright.close}.${styles.bold.close}`)
  })
})
