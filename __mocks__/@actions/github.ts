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
  data: {id: 1, owner: 'owner', repo: 'repo'}
})

let deleteRef = jest.fn().mockReturnValue({
  data: {id: 1, owner: 'owner', repo: 'repo'}
})

let listBranches = jest.fn().mockReturnValue({
  data: {id: 1, owner: 'owner', repo: 'repo'}
})

let getCommit = jest.fn().mockReturnValue({
  data: {id: 1, commit: {author: {date: 'January 25, 2006'}}, repo: 'repo'}
})

const github = {
  rest: {
    git: {deleteRef},
    issues: {
      update,
      create,
      listForRepo: jest.fn(),
      createComment: jest.fn()
    },
    repos: {
      get: jest.fn(),
      listBranches,
      getCommit
    }
  }
}

export const getOctokit = jest.fn().mockImplementation(() => github)
