import { BranchResponse } from '../../types/branches';
/**
 * Retrieves filtered list of branches
 *
 * @param {BranchResponse[]} branches A list of branches
 * @param {string | null} branchesFilterRegex A RegExp string that indicates which branches to include
 * @returns {BranchResponse[]} A filtered list of branches that meet the passed in RegEx @see {@link BranchResponse}
 */
export declare function filterBranches(branches: BranchResponse[], branchesFilterRegex: string | null): Promise<BranchResponse[]>;
