/**
 * Deletes a branch in a repository
 *
 * @param {string} name The name of a branch.
 *
 * @returns {number} HTTP response code (ex: 204)
 */
export declare function deleteBranch(name: string): Promise<number>;
