/**
 * Creates comment string string for GitHub issues
 *
 * @param {string} branch The name of a branch.
 *
 * @param {string} lastCommitter The username that last committed to the branch
 *
 * @param {number} commitAge The age (in days) of the last commit to a branch
 *
 * @param {number} daysBeforeDelete The amount of days before a branch is to be deleted
 *
 * @param {boolean} tagLastCommitter If true, the user that last committed to this branch will be tagged
 *
 * @param {object} [ignoredCommitInfo] Optional. Info about ignored commits (ignoredCount, usedFallback)
 *
 * @returns A string to use as a comment on a GitHub issue
 */
export function createCommentString(
  branch: string,
  lastCommitter: string,
  commitAge: number,
  daysBeforeDelete: number,
  tagLastCommitter: boolean,
  ignoredCommitInfo?: {ignoredCount: number; usedFallback: boolean}
): string {
  const daysUntilDelete = Math.max(0, daysBeforeDelete - commitAge)

  let bodyString: string
  switch (tagLastCommitter) {
    case true:
      bodyString = `@${lastCommitter}, \r \r ${branch} has had no activity for ${commitAge.toString()} days. \r \r This branch will be automatically deleted in ${daysUntilDelete.toString()} days. \r \r This issue was last updated on ${new Date().toString()}`
      break
    case false:
      bodyString = `${branch} has had no activity for ${commitAge.toString()} days. \r \r This branch will be automatically deleted in ${daysUntilDelete.toString()} days. \r \r This issue was last updated on ${new Date().toString()}`
      break
  }

  if (ignoredCommitInfo && ignoredCommitInfo.ignoredCount > 0) {
    bodyString += `\r \r _Note: Ignored ${ignoredCommitInfo.ignoredCount} commit${ignoredCommitInfo.ignoredCount > 1 ? 's' : ''} matching filter${ignoredCommitInfo.usedFallback ? ', used fallback' : ''}._`
  }

  return bodyString
}
