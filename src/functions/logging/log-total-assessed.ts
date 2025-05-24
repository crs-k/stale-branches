import styles from 'ansi-styles'

export function logTotalAssessed(outputStales: number, outputTotal: number): string {
  const totalAssessed = `${styles.bold.open}${styles.blueBright.open}Stale Branches Assessed${styles.blueBright.close}: [${styles.yellowBright.open}${outputStales}${styles.yellowBright.close}/${styles.magenta.open}${outputTotal}${styles.magenta.close}]${styles.bold.close}`

  return totalAssessed
}
