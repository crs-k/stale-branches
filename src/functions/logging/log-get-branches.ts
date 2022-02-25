import styles from 'ansi-styles'

export function logGetBranches(branchLength): string {
  const getBranches = `${styles.bold.open}[${styles.magenta.open}${branchLength}${styles.magenta.close}] ${styles.blueBright.open}branches found${styles.blueBright.close}.${styles.bold.close}`

  return getBranches
}
