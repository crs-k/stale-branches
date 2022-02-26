export interface BranchResponse {
  /**
   * The Name of the Branch.
   *
   * Example: test-branch-19
   */
  branchName: string

  /**
   * The SHA of a commit made to the Branch.
   *
   * Example: aef86c0cfec5f986ab3032af9010bbd6923b92ee
   */
  commmitSha: string
}
