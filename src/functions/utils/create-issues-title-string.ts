/**
 * Creates title string for GitHub issues
 *
 * @param {string} branchName The name of a branch.
 *
 * @return `[${branchName}] is STALE`
 */
export function createIssueTitleString(branchName: string): string {
  return `[${branchName}] is STALE`
}
