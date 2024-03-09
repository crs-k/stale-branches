import styles from 'ansi-styles'

export function logSkippedBranch(branchName): string {
  const skippedBranch = `[${styles.blueBright.open}${branchName}${styles.blueBright.close}] Skipped due to active pull request(s).`

  return skippedBranch
}
