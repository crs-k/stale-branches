import styles from 'ansi-styles'

export function logTotalAssessed(outputStales, outputTotal): string {
  const totalAssessed = `${styles.bold.open}${styles.blueBright.open}Stale Branches Assessed${styles.blueBright.close}: [${styles.yellowBright.open}${outputStales}${styles.yellowBright.close}/${styles.greenBright.open}${outputTotal}${styles.greenBright.close}]${styles.bold.close}`

  return totalAssessed
}
