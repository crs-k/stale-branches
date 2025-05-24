import {logTotalAssessed} from '../../../src/functions/logging/log-total-assessed'
import styles from 'ansi-styles'

// Mock ansi-styles
jest.mock('ansi-styles', () => ({
  bold: {
    open: '[BOLD]',
    close: '[/BOLD]'
  },
  blueBright: {
    open: '[BLUE_BRIGHT]',
    close: '[/BLUE_BRIGHT]'
  },
  yellowBright: {
    open: '[YELLOW_BRIGHT]',
    close: '[/YELLOW_BRIGHT]'
  },
  magenta: {
    open: '[MAGENTA]',
    close: '[/MAGENTA]'
  }
}))

describe('logTotalAssessed', () => {
  it('formats total assessed branches message with proper colors', () => {
    const outputStales = 5
    const outputTotal = 20
    
    const result = logTotalAssessed(outputStales, outputTotal)
    
    expect(result).toBe(
      `${styles.bold.open}${styles.blueBright.open}Stale Branches Assessed${styles.blueBright.close}: ` +
      `[${styles.yellowBright.open}${outputStales}${styles.yellowBright.close}/` +
      `${styles.magenta.open}${outputTotal}${styles.magenta.close}]${styles.bold.close}`
    )
  })

  it('handles zero stale branches', () => {
    const outputStales = 0
    const outputTotal = 10
    
    const result = logTotalAssessed(outputStales, outputTotal)
    
    expect(result).toBe(
      `${styles.bold.open}${styles.blueBright.open}Stale Branches Assessed${styles.blueBright.close}: ` +
      `[${styles.yellowBright.open}${outputStales}${styles.yellowBright.close}/` +
      `${styles.magenta.open}${outputTotal}${styles.magenta.close}]${styles.bold.close}`
    )
  })

  it('handles case where all branches are stale', () => {
    const outputStales = 10
    const outputTotal = 10
    
    const result = logTotalAssessed(outputStales, outputTotal)
    
    expect(result).toBe(
      `${styles.bold.open}${styles.blueBright.open}Stale Branches Assessed${styles.blueBright.close}: ` +
      `[${styles.yellowBright.open}${outputStales}${styles.yellowBright.close}/` +
      `${styles.magenta.open}${outputTotal}${styles.magenta.close}]${styles.bold.close}`
    )
  })
})
