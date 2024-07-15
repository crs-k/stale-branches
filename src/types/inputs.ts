export interface Inputs {
  /**
   * Number of days a branch has been inactive before it is considered stale.
   *
   * Must be a positive number.
   */
  daysBeforeStale: number

  /**
   * Number of days a branch has been inactive before it is deleted.
   *
   * Must be a positive number.
   */
  daysBeforeDelete: number

  /**
   * If this is enabled, a comment with updated information will be added to existing issues each workflow run.
   *
   * Must meet YAML 1.2 "Core Schema" specification.
   *
   * Support boolean input list: `true | True | TRUE | false | False | FALSE`.
   */
  commentUpdates: boolean

  /**
   * This dictates the number of stale branch issues that can exist. It also limits the number of branches that can be deleted per run.
   *
   * Must be a positive number.
   */
  maxIssues: number

  /**
   * When an issue is opened, this will tag the stale branchs last committer in the comments.
   *
   * Must meet YAML 1.2 "Core Schema" specification.
   *
   * Support boolean input list: `true | True | TRUE | false | False | FALSE`.
   */
  tagLastCommitter: boolean

  /**
   * Label to be applied to issues created for stale branches.
   *
   * Must be 50 characters or less.
   */
  staleBranchLabel: string

  /**
   * Compares current branch to default branch. Options: Options: off | info | save
   *
   * Comparison results in "diverged" | "ahead" | "behind" | "identical".
   */
  compareBranches: string

  /**
   * A Regex that will be used to filter branches from this action.
   *
   * Must be 50 characters or less.
   */
  branchesFilterRegex?: string

  /**
   * If this is enabled, the action will stop if it exceeds 95% of the GitHub API rate limit.
   *
   * Must meet YAML 1.2 "Core Schema" specification.
   *
   * Support boolean input list: `true | True | TRUE | false | False | FALSE`.
   */
  rateLimit: boolean

  /**
   * If this is enabled, the action will first check for active pull requests against the branch. If a branch has an active pr, it will not be ignored.
   *
   * Must meet YAML 1.2 "Core Schema" specification.
   *
   * Support boolean input list: `true | True | TRUE | false | False | FALSE`.
   */
  prCheck: boolean

  /**
   * If this is enabled, the action will not delete branches or create issues.
   *
   * Must meet YAML 1.2 "Core Schema" specification.
   *
   * Support boolean input list: `true | True | TRUE | false | False | FALSE`.
   */
  dryRun: boolean
  /**
   * If this is enabled, the action will ignore any issue interactions.
   *
   * Must meet YAML 1.2 "Core Schema" specification.
   *
   * Support boolean input list: `true | True | TRUE | false | False | FALSE`.
   */
  ignoreIssueInteraction: boolean
}
