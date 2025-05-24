/**
 * Creates comment on existing GitHub issue
 *
 * @param {number} issueNumber GitHub issue number
 *
 * @param {string} branch The branch currently being worked on
 *
 * @param {number} commitAge The age (in days) of the last commit to a branch
 *
 * @param {string} lastCommitter The username that last committed to the branch
 *
 * @param {boolean} commentUpdates If true, a comment will be made on the target issue
 *
 * @param {number} daysBeforeDelete The amount of days before a branch is to be deleted
 *
 * @param {string} staleBranchLabel The label to be used to identify issues related to this Action
 *
 * @param {boolean} tagLastCommitter If true, the user that last committed to this branch will be tagged
 *
 * @returns {string} The time the comment was created
 */
export declare function createIssueComment(issueNumber: number, branch: string, commitAge: number, lastCommitter: string, commentUpdates: boolean, daysBeforeDelete: number, staleBranchLabel: string, tagLastCommitter: boolean): Promise<string>;
