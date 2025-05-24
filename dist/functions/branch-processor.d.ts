import { Inputs } from '../types/inputs';
import { BranchResponse } from '../types/branches';
import { IssueResponse } from '../types/issues';
export interface BranchProcessingResult {
    shouldSkip: boolean;
    reason?: string;
    activePrs?: number;
}
export interface BranchProcessingContext {
    validInputs: Inputs;
    existingIssues: IssueResponse[];
    issueBudgetRemaining: number;
    outputStales: string[];
    outputDeletes: string[];
}
/**
 * Checks if a branch should be skipped due to rate limiting
 */
export declare function checkRateLimit(validInputs: Inputs): Promise<boolean>;
/**
 * Checks if a branch should be skipped due to active pull requests
 */
export declare function checkActivePullRequests(branchName: string, validInputs: Inputs): Promise<BranchProcessingResult>;
/**
 * Gets the commit age for a branch, handling ignored commit messages
 */
export declare function getBranchCommitAge(commitSha: string, validInputs: Inputs): Promise<number>;
/**
 * Gets the last committer login if tagging is enabled
 */
export declare function getLastCommitterLogin(commitSha: string, validInputs: Inputs): Promise<string>;
/**
 * Processes branch metadata and prepares for branch assessment
 */
export declare function prepareBranchAssessment(branch: BranchResponse, validInputs: Inputs): Promise<{
    commitAge: number;
    issueTitleString: string;
    lastCommitLogin: string;
    branchComparison: any;
}>;
