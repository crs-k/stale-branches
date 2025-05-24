/**
 * Closes a GitHub issue
 *
 * @param {number} issueNumber GitHub issue number
 *
 * @returns {string} The state of an issue (i.e. closed)
 */
export declare function closeIssue(issueNumber: number): Promise<string>;
