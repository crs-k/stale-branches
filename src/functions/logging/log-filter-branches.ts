import styles from 'ansi-styles'

export function logFilterBranches(branchLength): string {
  return  `${styles.bold.open}[${styles.magenta.open}${branchLength}${styles.magenta.close}] ${styles.blueBright.open}branches found after filtering${styles.blueBright.close}.${styles.bold.close}`

}
