import styles from 'ansi-styles'

export function logTotalDeleted(outputDeletes: number, outputStales: number): string {
  const totalDeleted = `${styles.bold.open}${styles.blueBright.open}Stale Branches Deleted${styles.blueBright.close}: [${styles.redBright.open}${outputDeletes}${styles.redBright.close}/${styles.yellowBright.open}${outputStales}${styles.yellowBright.close}]${styles.bold.close}`

  return totalDeleted
}
