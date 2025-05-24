import { BranchResponse } from '../types/branches';
/**
 * Removes branches that don´t allow deletions
 */
export declare function checkBranchProtection(branches: BranchResponse[]): Promise<void>;
