import { BranchResponse } from '../types/branches';
/**
 * Retrieves all branches in a repository
 *
 * @returns {BranchResponse} A subset of data on all branches in a repository @see {@link BranchResponse}
 */
export declare function getBranches(includeProtectedBranches: boolean): Promise<BranchResponse[]>;
