export interface IssueTitle {
  repoToken: string
  owner: string
  repo: string
  daysBeforeStale: number
  daysBeforeDelete: number
  commentUpdates: boolean
  maxIssues: number
  tagLastCommitter: boolean
}
