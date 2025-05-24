/**
 * Retrieves last committer's username
 *
 * @param {string} sha The SHA of the last commit
 *
 * @returns {string} The last committers username
 */
export declare function getRecentCommitLogin(sha: string): Promise<string>;
