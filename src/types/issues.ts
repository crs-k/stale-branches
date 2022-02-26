export interface IssueResponse {
  /**
   * The Title of the GitHub Issue.
   *
   * Example: [test-branch-19] is STALE
   */
  issueTitle: string

  /**
   * The Number of the GitHub Issue.
   *
   * Example: 350
   */
  issueNumber: number
}
