/**
 * Creates a GitHub issue
 *
 * @param {string} branch The branch currently being worked on
 *
 * @param {number} commitAge The age (in days) of the last commit to a branch
 *
 * @param {string} lastCommitter The username that last committed to the branch
 *
 * @param {number} daysBeforeDelete The amount of days before a branch is to be deleted
 *
 * @param {string} staleBranchLabel The label to be used to identify issues related to this Action
 *
 * @param {boolean} tagLastCommitter If true, the user that last committed to this branch will be tagged
 *
 * @returns {number} The ID of the issue created
 */
export declare function createIssue(branch: string, commitAge: number, lastCommitter: string, daysBeforeDelete: number, staleBranchLabel: string, tagLastCommitter: boolean): Promise<number>;
