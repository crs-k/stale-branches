import styles from 'ansi-styles'

export function logOrphanedIssues(orphanCount: number): string {
  const orphanedIssues = `${styles.bold.open}[${styles.magenta.open}${orphanCount}${styles.magenta.close}] ${styles.blueBright.open}orphaned issues found${styles.blueBright.close}.${styles.bold.close}`

  return orphanedIssues
}
