import * as core from '@actions/core'
import {BranchResponse} from '../../src/types/branches'
import {getBranches} from '../../src/functions/get-branches'
import {github} from '../../src/functions/get-context'
import styles from 'ansi-styles'

jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('../../src/functions/get-context')

describe('Get Branches Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('github.paginate endpoint is called', async () => {
    const mockInfo = jest.fn()
    ;(core.info as jest.Mock) = mockInfo

    // Mock successful response with 6 branches
    const mockBranches = Array.from({length: 6}, (_, i) => ({
      branchName: `branch${i + 1}`,
      commitSha: `sha${i + 1}`
    }))
    
    jest.spyOn(github, 'paginate').mockResolvedValueOnce(mockBranches)

    await getBranches(false)

    expect(github.paginate).toHaveBeenCalled()
    expect(core.info).toHaveBeenCalledWith(
      `${styles.bold.open}[${styles.magenta.open}6${styles.magenta.close}] ${styles.blueBright.open}branches found${styles.blueBright.close}.${styles.bold.close}`
    )
  })

  test('Action fails elegantly - Error', async () => {
    const mockSetFailed = jest.fn()
    ;(core.setFailed as jest.Mock) = mockSetFailed

    // Mock the paginate call to return null to trigger the error condition
    jest.spyOn(github, 'paginate').mockResolvedValueOnce(null)

    await getBranches(false)
    expect(core.setFailed).toHaveBeenCalledWith(
      'Failed to retrieve branches for repo. Error: Response cannot be empty.'
    )
  })

  test('Action fails elegantly - String', async () => {
    const mockSetFailed = jest.fn()
    ;(core.setFailed as jest.Mock) = mockSetFailed

    // Mock the paginate call to throw a string error
    jest.spyOn(github, 'paginate').mockRejectedValueOnce('Response cannot be empty.')

    await getBranches(false)
    expect(core.setFailed).toHaveBeenCalledWith('Failed to retrieve branches for repo.')
  })

  test('Handles error in paginate', async () => {
    const mockSetFailed = jest.fn()
    const mockInfo = jest.fn()
    ;(core.setFailed as jest.Mock) = mockSetFailed
    ;(core.info as jest.Mock) = mockInfo

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
