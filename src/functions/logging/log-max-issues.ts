import styles from 'ansi-styles'

export function logMaxIssues(issueBudgetRemaining): string {
  let maxIssues = `[${styles.magenta.open}${issueBudgetRemaining}${styles.magenta.close}] max-issues budget remaining.`

  //color group based on age of branch
  if (issueBudgetRemaining < 1) {
    maxIssues = `[${styles.redBright.open}${issueBudgetRemaining}${styles.redBright.close}] max-issues budget remaining.`
  } else if (issueBudgetRemaining < 5) {
    maxIssues = `[${styles.yellowBright.open}${issueBudgetRemaining}${styles.yellowBright.close}] max-issues budget remaining.`
  }

  return maxIssues
}
