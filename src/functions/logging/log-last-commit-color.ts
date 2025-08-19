import styles from 'ansi-styles'

export function logLastCommitColor(commitAge, daysBeforeStale, daysBeforeDelete, ignoredCommitInfo?: {ignoredCount: number; usedFallback: boolean}, committer?: string, sha?: string): string {
  if (ignoredCommitInfo && ignoredCommitInfo.usedFallback) {
    return `${styles.redBright.open}No meaningful commit found in the last ${daysBeforeDelete} days (days-before-delete).${styles.redBright.close} ${styles.cyan.open}(ignored ${ignoredCommitInfo.ignoredCount} commit${ignoredCommitInfo.ignoredCount > 1 ? 's' : ''} matching filter, used days-before-delete fallback)${styles.cyan.close}`
  }

  let label = 'Last Meaningful Commit:'
  let commitColor = `${label} ${styles.magenta.open}${commitAge.toString()}${styles.magenta.close} days ago`
  if (committer) {
    commitColor += ` by ${styles.bold.open}${committer}${styles.bold.close}`
  }
  if (sha) {
    commitColor += ` ${styles.cyan.open}SHA: ${sha}${styles.cyan.close}`
  }
  commitColor += '.'

  //color group based on age of branch
  if (commitAge > daysBeforeDelete) {
    commitColor = `${styles.redBright.open}${commitColor}${styles.redBright.close}`
  } else if (commitAge > daysBeforeStale) {
    commitColor = `${styles.yellow.open}${commitColor}${styles.yellow.close}`
  } else {
    commitColor = `${styles.green.open}${commitColor}${styles.green.close}`
  }

  if (ignoredCommitInfo && ignoredCommitInfo.ignoredCount > 0) {
    commitColor += ` ${styles.cyan.open}(ignored ${ignoredCommitInfo.ignoredCount} commit${ignoredCommitInfo.ignoredCount > 1 ? 's' : ''} matching filter${ignoredCommitInfo.usedFallback ? ', used days-before-delete fallback' : ''})${styles.cyan.close}`
  }
  return commitColor
}
