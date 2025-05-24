import { Inputs } from '../types/inputs';
import { IssueResponse } from '../types/issues';
export interface IssueProcessingResult {
    issueBudgetRemaining: number;
    staleAdded: boolean;
}
/**
 * Handles closing an issue with proper logging and dry-run support
 */
export declare function closeIssueWithLogging(issueNumber: number, validInputs: Inputs, branchName: string): Promise<string>;
/**
 * Creates a new issue for a stale branch
 */
export declare function createStaleIssue(branchName: string, commitAge: number, lastCommitLogin: string, validInputs: Inputs, issueBudgetRemaining: number): Promise<IssueProcessingResult>;
/**
 * Updates an existing issue for a stale branch
 */
export declare function updateStaleIssue(issueNumber: number, branchName: string, commitAge: number, lastCommitLogin: string, validInputs: Inputs): Promise<void>;
/**
 * Processes issues for branches that have become active again
 */
export declare function processActiveBranchIssues(branchName: string, issueTitleString: string, filteredIssues: IssueResponse[], validInputs: Inputs): Promise<void>;
/**
 * Processes issues for stale branches (create new or update existing)
 */
export declare function processStaleBranchIssues(branchName: string, issueTitleString: string, commitAge: number, lastCommitLogin: string, filteredIssues: IssueResponse[], validInputs: Inputs, issueBudgetRemaining: number): Promise<IssueProcessingResult>;
