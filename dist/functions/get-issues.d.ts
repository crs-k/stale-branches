import { IssueResponse } from '../types/issues';
/**
 * Retrieves GitHub issues with the `staleBranchLabel` label attached
 *
 * @param {string} staleBranchLabel The label to be used to identify issues related to this Action
 *
 * @returns {IssueResponse} A subset of the issue data @see {@link IssueResponse}
 */
export declare function getIssues(staleBranchLabel: string): Promise<IssueResponse[]>;
