export const context = {
  repo: {
    owner: 'owner',
    repo: 'repo'
  }
}

export const daysBeforeStale: number = 120
export const daysBeforeDelete: number = 180
export const commentUpdates: boolean = true

const github = {
  rest: {
    git: {deleteRef: jest.fn()},
    issues: {
      update: jest.fn(),
      create: jest.fn(),
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
