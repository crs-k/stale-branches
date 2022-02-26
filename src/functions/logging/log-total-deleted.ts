import styles from 'ansi-styles'

export function logTotalDeleted(outputDeletes, outputStales): string {
  const totalDeleted = `${styles.bold.open}${styles.blueBright.open}Stale Branches Assessed${styles.blueBright.close}: [${styles.redBright.open}${outputDeletes}${styles.redBright.close}/${styles.yellowBright.open}${outputStales}${styles.yellowBright.close}]${styles.bold.close}`

  return totalDeleted
}
