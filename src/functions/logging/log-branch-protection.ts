import styles from 'ansi-styles'

/**
 * Returns a log string for branch protection status with detailed information.
 *
 * @param {boolean} isProtected - Whether the branch is protected
 * @param {boolean} canDelete - Whether the branch can be deleted based on include settings
 * @param {string} protectionType - Type of protection (e.g., 'branch protection', 'ruleset', 'default branch')
 * @param {string} branchName - Name of the branch being checked
 * @returns {string} The log message for branch protection status
 */
export function logBranchProtection(isProtected: boolean, canDelete: boolean, protectionType?: string, branchName?: string): string {
  if (isProtected) {
    const typeInfo = protectionType ? ` (${protectionType})` : ''
    if (canDelete) {
      return `${styles.bold.open}${styles.yellowBright.open}protected branch: true${typeInfo}${styles.yellowBright.close}${styles.bold.close} (included)`
    } else {
      return `${styles.bold.open}${styles.redBright.open}protected branch: true${typeInfo}${styles.redBright.close}${styles.bold.close} (skipped)`
    }
  } else {
    // Log unprotected status for better debugging
    return `${styles.bold.open}${styles.greenBright.open}protected branch: false${styles.greenBright.close}${styles.bold.close} (processing)`
  }
}
