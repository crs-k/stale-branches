import styles from 'ansi-styles'

export function logSkippedBranch(branchName, activePrs): string {
  const skippedBranch = `${styles.bold.open}${branchName}${styles.bold.close} Skipped due to ${styles.magenta.open}${activePrs}${styles.magenta.close} active pull request(s).`

  return skippedBranch
}
