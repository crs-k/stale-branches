export const context = {
  repo: {
    owner: 'owner',
    repo: 'repo'
  }
}

const github = {
  rest: {
    repos: {
      get: jest.fn(),
      listBranches: jest.fn()
    }
  }
}

export const getOctokit = jest.fn().mockImplementation(() => github)
