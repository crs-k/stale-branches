import {BranchResponse} from '../../src/types/branches'

jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('assert')
jest.mock('../../src/functions/get-context')

const core = require('@actions/core')
const assert = require('assert')
import {getBranches} from '../../src/functions/get-branches'
import {github} from '../../src/functions/get-context'
import styles from 'ansi-styles'

describe('Get Branches Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Set up default paginate mock to actually call the mapper function
    ;(github.paginate as any) = jest.fn().mockImplementation(async (endpoint: any, options: any, mapper?: any) => {
      // Mock the raw response that would come from the API
      const mockResponse = {
        data: [
          {name: 'branch1', commit: {sha: 'sha1'}},
          {name: 'branch2', commit: {sha: 'sha2'}},
          {name: 'branch3', commit: {sha: 'sha3'}},
          {name: 'branch4', commit: {sha: 'sha4'}},
          {name: 'branch5', commit: {sha: 'sha5'}},
          {name: 'branch6', commit: {sha: 'sha6'}}
        ]
      }
      // Call the mapper function to achieve coverage
      return mapper ? mapper(mockResponse) : []
    })
  })
  
  test('github.paginate endpoint is called', async () => {
    core.info = jest.fn()
    assert.ok = jest.fn()
    await getBranches(false)

    expect(github.paginate).toHaveBeenCalled()
    expect(core.info).toHaveBeenCalledWith(`${styles.bold.open}[${styles.magenta.open}6${styles.magenta.close}] ${styles.blueBright.open}branches found${styles.blueBright.close}.${styles.bold.close}`)
    expect(assert.ok).toHaveBeenCalled()
  })

  test('Action fails elegantly - Error', async () => {
    core.setFailed = jest.fn()
    assert.ok = jest.fn()
    assert.ok.mockImplementationOnce(() => {
      throw new Error('Response cannot be empty.')
    })

    await getBranches(false)
    expect(core.setFailed).toHaveBeenCalledWith(`Failed to retrieve branches for repo. Error: Response cannot be empty.`)
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

  test('Include protected branches activated', async () => {
    // Mock the response you expect from paginate
    const paginateResponse: BranchResponse[] = [
      {branchName: 'branch1', commmitSha: 'commit1'},
      {branchName: 'branch2', commmitSha: 'commit2'}
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
      {branchName: 'branch1', commmitSha: 'commit1'},
      {branchName: 'branch2', commmitSha: 'commit2'}
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
