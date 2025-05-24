import {logTotalDeleted} from '../../../src/functions/logging/log-total-deleted'
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
  redBright: {
    open: '[RED_BRIGHT]',
    close: '[/RED_BRIGHT]'
  },
  yellowBright: {
    open: '[YELLOW_BRIGHT]',
    close: '[/YELLOW_BRIGHT]'
  }
}))

describe('logTotalDeleted', () => {
  it('formats total deleted branches message with proper colors', () => {
    const outputDeletes = 3
    const outputStales = 5
    
    const result = logTotalDeleted(outputDeletes, outputStales)
    
    expect(result).toBe(
      `${styles.bold.open}${styles.blueBright.open}Stale Branches Deleted${styles.blueBright.close}: ` +
      `[${styles.redBright.open}${outputDeletes}${styles.redBright.close}/` +
      `${styles.yellowBright.open}${outputStales}${styles.yellowBright.close}]${styles.bold.close}`
    )
  })

  it('handles zero deleted branches', () => {
    const outputDeletes = 0
    const outputStales = 5
    
    const result = logTotalDeleted(outputDeletes, outputStales)
    
    expect(result).toBe(
      `${styles.bold.open}${styles.blueBright.open}Stale Branches Deleted${styles.blueBright.close}: ` +
      `[${styles.redBright.open}${outputDeletes}${styles.redBright.close}/` +
      `${styles.yellowBright.open}${outputStales}${styles.yellowBright.close}]${styles.bold.close}`
    )
  })

  it('handles case where all stale branches are deleted', () => {
    const outputDeletes = 5
    const outputStales = 5
    
    const result = logTotalDeleted(outputDeletes, outputStales)
    
    expect(result).toBe(
      `${styles.bold.open}${styles.blueBright.open}Stale Branches Deleted${styles.blueBright.close}: ` +
      `[${styles.redBright.open}${outputDeletes}${styles.redBright.close}/` +
      `${styles.yellowBright.open}${outputStales}${styles.yellowBright.close}]${styles.bold.close}`
    )
  })
})
