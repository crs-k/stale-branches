export interface IssueResponse {
  /**
   * The title of the GitHub issue.
   *
   * Example: [test-branch-19] is STALE
   */
  issueTitle: string

  /**
   * The number of the GitHub issue.
   *
   * Example: 350
   */
  issueNumber: number
}
