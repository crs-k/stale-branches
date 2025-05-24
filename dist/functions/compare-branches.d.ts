import { BranchComparison } from '../types/branch-comparison';
/**
 * Compares HEAD branch to BASE branch
 *
 * @param {string} head The name of the head branch
 *
 * @param {string} inputCompareBranches The value from the compare-branches input
 *
 * @returns {BranchComparison} The status of the HEAD branch vs. BASE branch @see {@link BranchComparison}
 */
export declare function compareBranches(head: string, inputCompareBranches: string): Promise<BranchComparison>;
