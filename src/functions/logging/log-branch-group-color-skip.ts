import styles from 'ansi-styles'

export function logBranchGroupColorSkip(branchName: string): string {
  const groupColor = `[${styles.blueBright.open}${branchName}${styles.blueBright.close}]`

  return groupColor
}
