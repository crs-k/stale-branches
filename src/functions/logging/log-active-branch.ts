import styles from 'ansi-styles'

export function logActiveBranch(branchName: string): string {
  const closeIssue = `[${styles.green.open}${branchName}${styles.green.close}] has become active again.`

  return closeIssue
}
