import {PaginateInterface} from '@octokit/plugin-paginate-rest'

export const context = {
  repo: {
    owner: 'owner',
    repo: 'repo'
  }
}

export const daysBeforeStale: number = 120
export const daysBeforeDelete: number = 180
export const commentUpdates: boolean = true
export const maxIssues: number = 20
export const repoToken: string = '20'

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
  data: {
    id: 1,
    commit: {committer: {date: 'January 25, 2006'}},
    repo: 'repo',
    committer: {login: 'crs-k'}
  }
})

let listForRepo = jest.fn().mockReturnValue({
  data: {id: 1, owner: 'owner', repo: 'repo'}
})

let createComment = jest.fn().mockReturnValue({
  data: {id: 1, owner: 'owner', repo: 'repo'}
})

let iterator = jest.fn().mockReturnValue(listBranches)

const github = {
  rest: {
    git: {deleteRef},
    issues: {
      update,
      create,
      listForRepo,
      createComment
    },
    repos: {
      get: jest.fn(),
      listBranches,
      getCommit
    }
  },
  paginate: {
    iterator
  }
}

export const getOctokit = jest.fn().mockImplementation(() => github)
