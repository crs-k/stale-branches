import styles from 'ansi-styles'

export function logNewIssue(branchName): string {
  const newIssue = `${styles.bold.open}New issue created:${styles.bold.close} ${styles.magentaBright.open}[${branchName}] is STALE${styles.magentaBright.close}.`

  return newIssue
}
