export interface BranchComparison {
  /**
   * The comparative status of the head branch to the base branch.
   *
   * Example: "diverged" | "ahead" | "behind" | "identical"
   */
  branchStatus: string

  /**
   * How many commits the head branch is ahead of the base branch.
   *
   * Example: 1
   */
  aheadBy: number

  /**
   * How many commits the head branch is behind the base branch.
   *
   * Example: 2
   */
  behindBy: number

  /**
   * The total number of commits to the base branch
   *
   * Example: 1
   */
  totalCommits: number

  /**
   * If a branch has a status of ahead or diverged, this will be true.
   */
  save: boolean
}
