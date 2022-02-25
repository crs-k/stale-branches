import styles from 'ansi-styles'

export function logCloseIssue(issueNumber, state): string {
  const closeIssue = `Issue ${styles.cyan.open}#${issueNumber}${styles.cyan.close}'s state was changed to ${styles.redBright.open}${state}${styles.redBright.close}.`

  return closeIssue
}
