import styles from 'ansi-styles'

export function logSkippedBranch(branchName: string, activePrs: number): string {
  const skippedBranch = `${styles.bold.open}${branchName}${styles.bold.close} was skipped due to ${styles.magenta.open}${activePrs}${styles.magenta.close} active pull request(s).`

  return skippedBranch
}
