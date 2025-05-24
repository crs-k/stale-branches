/**
 * Retrieves all pull requests for a branch in a repository
 *
 * @returns {pullRequests} A count of active pull requests for a branch
 */
export declare function getPr(branch: string): Promise<number>;
