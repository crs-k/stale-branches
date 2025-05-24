/**
 * Calculates the amount of issues that can be created during this workflow run
 *
 * @param {number} maxIssues The total number of issues that can exist for this action
 *
 * @param {string} staleBranchLabel The label to be used to identify issues related to this Action
 *
 * @returns {string} The maximum amount of issues that can be created during a workflow run
 */
export declare function getIssueBudget(maxIssues: number, staleBranchLabel: string): Promise<number>;
