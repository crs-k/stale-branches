export interface Inputs {
  /**
   * Token to use to authenticate with GitHub API.
   */
  repoToken: string

  /**
   * Repository Owner
   */
  owner: string

  /**
   * Repository
   */
  repo: string

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
   */
  commentUpdates: boolean

  /**
   * This dictates the number of stale branch issues that can exist. It also limits the number of branches that can be deleted per run.
   */
  maxIssues: number

  /**
   * When an issue is opened, this will tag the stale branchs last committer in the comments.
   */
  tagLastCommitter: boolean
}
