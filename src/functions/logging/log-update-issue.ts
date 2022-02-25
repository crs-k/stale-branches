import styles from 'ansi-styles'

export function logUpdateIssue(issueNumber, createdAt, commentUrl): string {
  const updateIssue = `Issue ${styles.cyan.open}#${issueNumber}${styles.cyan.close} comment was created at ${styles.magenta.open}${createdAt}${styles.magenta.close}. ${commentUrl}`

  return updateIssue
}
