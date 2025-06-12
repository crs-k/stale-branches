import {logGetPr} from '../../../src/functions/logging/log-get-pr'
import styles from 'ansi-styles'

describe('logGetPr', () => {
  it('returns formatted message for single pull request', () => {
    const prLength = 1
    const result = logGetPr(prLength)
    const expected = `${styles.bold.open}[${styles.magenta.open}${prLength}${styles.magenta.close}] ${styles.blueBright.open}pull requests found${styles.blueBright.close}.${styles.bold.close}`
    
    expect(result).toBe(expected)
  })

  it('returns formatted message for multiple pull requests', () => {
    const prLength = 5
    const result = logGetPr(prLength)
    const expected = `${styles.bold.open}[${styles.magenta.open}${prLength}${styles.magenta.close}] ${styles.blueBright.open}pull requests found${styles.blueBright.close}.${styles.bold.close}`
    
    expect(result).toBe(expected)
  })

  it('returns formatted message for zero pull requests', () => {
    const prLength = 0
    const result = logGetPr(prLength)
    const expected = `${styles.bold.open}[${styles.magenta.open}${prLength}${styles.magenta.close}] ${styles.blueBright.open}pull requests found${styles.blueBright.close}.${styles.bold.close}`
    
    expect(result).toBe(expected)
  })
})