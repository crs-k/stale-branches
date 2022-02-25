import styles from 'ansi-styles'

export function logCloseIssue(issueNumber, state): string {
  const closeIssue = `Issue ${styles.cyanBright.open}#${issueNumber}${styles.cyanBright.close}'s state was changed to ${styles.redBright.open}${state}${styles.redBright.close}.`

  return closeIssue
}
