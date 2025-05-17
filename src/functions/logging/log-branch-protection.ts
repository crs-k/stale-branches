import styles from 'ansi-styles'

/**
 * Returns a log string for branch protection status, or an empty string if not protected.
 *
 * @param {boolean} isProtected - Whether the branch is protected
 * @param {boolean} includeProtectedBranches - Whether protected branches are included for staleness/deletion
 * @returns {string} The log message for branch protection status
 */
export function logBranchProtection(isProtected: boolean, includeProtectedBranches: boolean): string {
  if (!isProtected) return ''
  if (includeProtectedBranches) {
    return `${styles.bold.open}${styles.yellowBright.open}protected branch: true${styles.yellowBright.close}${styles.bold.close} (included)`
  } else {
    return `${styles.bold.open}${styles.redBright.open}protected branch: true${styles.redBright.close}${styles.bold.close} (skipped)`
  }
}
