import {BranchResponse} from '../../src/types/branches'
import {getBranches} from '../../src/functions/get-branches'
import {github} from '../../src/functions/get-context'
import styles from 'ansi-styles'

jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('assert')
jest.mock('../../src/functions/get-context')

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, import/no-commonjs
const core = require('@actions/core')
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, import/no-commonjs
const assert = require('assert')

describe('Get Branches Function', () => {
  test('github.paginate endpoint is called', async () => {
    core.info = jest.fn()
    assert.ok = jest.fn()
    await getBranches(false)

    expect(github.paginate).toHaveBeenCalled()
    expect(core.info).toHaveBeenCalledWith(
      `${styles.bold.open}[${styles.magenta.open}6${styles.magenta.close}] ${styles.blueBright.open}branches found${styles.blueBright.close}.${styles.bold.close}`
    )
    expect(assert.ok).toHaveBeenCalled()
  })

  test('Action fails elegantly - Error', async () => {
    core.setFailed = jest.fn()
    assert.ok = jest.fn()
    assert.ok.mockImplementationOnce(() => {
      throw new Error('Response cannot be empty.')
    })

    await getBranches(false)
    expect(core.setFailed).toHaveBeenCalledWith(
      `Failed to retrieve branches for repo. Error: Response cannot be empty.`
    )
  })

  test('Action fails elegantly - String', async () => {
    core.setFailed = jest.fn()
    assert.ok = jest.fn()
    assert.ok.mockImplementationOnce(() => {
      throw new String('Response cannot be empty.')
    })

    await getBranches(false)
    expect(core.setFailed).toHaveBeenCalledWith(`Failed to retrieve branches for repo.`)
  })

  test('Handles error in paginate', async () => {
    core.setFailed = jest.fn()
    core.info = jest.fn()
    assert.ok = jest.fn()

    // Mock the paginate function with proper error handling
    const mockError = new Error('API rate limit exceeded')
    jest.spyOn(github, 'paginate').mockImplementationOnce(() => {
      throw mockError
    })

    await getBranches(false)

    expect(core.setFailed).toHaveBeenCalledWith('Failed to retrieve branches for repo. Error: API rate limit exceeded')
  })

  test('Include protected branches activated', async () => {
    // Mock the response you expect from paginate
    const paginateResponse: BranchResponse[] = [
      {branchName: 'branch1', commitSha: 'commit1'},
      {branchName: 'branch2', commitSha: 'commit2'}
    ]

    // Spy on github.paginate and mock its resolved value
    const paginateSpy = jest.spyOn(github, 'paginate').mockResolvedValueOnce(paginateResponse)

    // Call your function
    const branchResponse = await getBranches(true)

    // Assert that github.paginate was called with expected arguments
    expect(paginateSpy).toHaveBeenCalledWith(
      github.rest.repos.listBranches,
      {
        owner: expect.any(String),
        repo: expect.any(String),
        per_page: expect.any(Number)
      },
      expect.any(Function)
    )
    expect(branchResponse).toEqual(paginateResponse)
  })

  test('Include protected branches deactivated', async () => {
    // Mock the response you expect from paginate
    const paginateResponse: BranchResponse[] = [
      {branchName: 'branch1', commitSha: 'commit1'},
      {branchName: 'branch2', commitSha: 'commit2'}
    ]

    // Spy on github.paginate and mock its resolved value
    const paginateSpy = jest.spyOn(github, 'paginate').mockResolvedValueOnce(paginateResponse)

    // Call your function
    const branchResponse = await getBranches(false)

    // Assert that github.paginate was called with expected arguments
    expect(paginateSpy).toHaveBeenCalledWith(
      github.rest.repos.listBranches,
      {
        owner: expect.any(String),
        repo: expect.any(String),
        per_page: expect.any(Number),
        protected: false
      },
      expect.any(Function)
    )
    expect(branchResponse).toEqual(paginateResponse)
  })
})
