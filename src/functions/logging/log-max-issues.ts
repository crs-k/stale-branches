import styles from 'ansi-styles'

export function logMaxIssues(issueBudgetRemaining): string {
  let maxIssues = `${styles.bold.open}[${styles.magenta.open}${issueBudgetRemaining}${styles.magenta.close}] ${styles.blueBright.open}max-issues budget remaining${styles.blueBright.close}.${styles.bold.close}`

  //color group based on age of branch
  if (issueBudgetRemaining < 1) {
    maxIssues = `${styles.bold.open}[${styles.redBright.open}${issueBudgetRemaining}${styles.redBright.close}] ${styles.blueBright.open}max-issues budget remaining${styles.blueBright.close}.${styles.bold.close}`
  } else if (issueBudgetRemaining < 5) {
    maxIssues = `${styles.bold.open}[${styles.yellowBright.open}${issueBudgetRemaining}${styles.yellowBright.close}] ${styles.blueBright.open}max-issues budget remaining${styles.blueBright.close}.${styles.bold.close}`
  }

  return maxIssues
}
