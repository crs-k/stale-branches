export const context = {
  repo: {
    owner: 'owner',
    repo: 'repo'
  }
}

export const daysBeforeStale: number = 120
export const daysBeforeDelete: number = 180
export const commentUpdates: boolean = true
let update = jest.fn().mockReturnValue({
  data: {issue_number: 1, owner: 'owner', repo: 'repo', state: 'closed'}
})

let create = jest.fn().mockReturnValue({
  data: {id: 1, owner: 'owner', repo: 'repo', state: 'closed'}
})

const github = {
  rest: {
    git: {deleteRef: jest.fn()},
    issues: {
      update,
      create,
      listForRepo: jest.fn(),
      createComment: jest.fn()
    },
    repos: {
      get: jest.fn(),
      listBranches: jest.fn(),
      getCommit: jest.fn()
    }
  }
}

export const getOctokit = jest.fn().mockImplementation(() => github)
