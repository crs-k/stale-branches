export interface Inputs {
  /**
   * Number of days a branch has been inactive before it is considered stale.
   */
  daysBeforeStale: number

  /**
   * Number of days a branch has been inactive before it is deleted.
   */
  daysBeforeDelete: number

  /**
   * If this is enabled, a comment with updated information will be added to existing issues each workflow run.
   *
   * Must meet YAML 1.2 "Core Schema" specification
   *
   * Support boolean input list: `true | True | TRUE | false | False | FALSE`
   */
  commentUpdates: boolean

  /**
   * This dictates the number of stale branch issues that can exist. It also limits the number of branches that can be deleted per run.
   */
  maxIssues: number

  /**
   * When an issue is opened, this will tag the stale branchs last committer in the comments.
   *
   * Must meet YAML 1.2 "Core Schema" specification
   *
   * Support boolean input list: `true | True | TRUE | false | False | FALSE`
   */
  tagLastCommitter: boolean

  /**
   * Label to be applied to issues created for stale branches.
   */
  staleBranchLabel: string
}
