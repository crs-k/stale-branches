export function createCommentString(branch: string, lastCommitter: string, commitAge: number, daysBeforeDelete: number, commentUpdates: boolean, tagLastCommitter: boolean): string {
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

  return bodyString
}
