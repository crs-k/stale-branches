import styles from 'ansi-styles'

export function logDeleteBranch(refFull): string {
  const deleteBranch = `Branch: ${styles.redBright.open}${refFull}${styles.redBright.close} has been ${styles.redBright.open}deleted${styles.redBright.close}.`

  return deleteBranch
}
