/**
 * Calcualtes the age of a commit in days
 *
 * @param {string} sha The SHA of the last commit
 *
 * @returns {number} The age of the commit
 */
export declare function getRecentCommitAge(sha: string): Promise<number>;
/**
 * Calculates the age of the most recent commit not matching any ignored commit messages, up to a max age.
 *
 * @param {string} sha The SHA of the branch head
 * @param {string[]} ignoredMessages Array of commit messages or substrings to ignore
 * @param {number} [maxAgeDays] Optional. If provided, stop searching if a commit is older than this many days.
 *
 * @returns {number} The age of the most recent non-ignored commit, or maxAgeDays if none found within that range
 */
export declare function getRecentCommitAgeByNonIgnoredMessage(sha: string, ignoredMessages: string[], maxAgeDays?: number): Promise<number>;
