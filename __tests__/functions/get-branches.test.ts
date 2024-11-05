import {checkBranchProtection} from '../../src/functions/check-branch-protection'
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
    assert.ok.mockImplementation(() => {
      throw new Error('Response cannot be empty.')
    })

    await getBranches(false)
    expect(core.setFailed).toHaveBeenCalledWith(`Failed to retrieve branches for repo. Error: Response cannot be empty.`)
  })

  test('Action fails elegantly - String', async () => {
    core.setFailed = jest.fn()
    assert.ok = jest.fn()
    assert.ok.mockImplementation(() => {
      throw new String('Response cannot be empty.')
    })

    await getBranches(false)
    expect(core.setFailed).toHaveBeenCalledWith(`Failed to retrieve branches for repo.`)
  })

  test('Include protected branches activated', async () => {
    core.info = jest.fn()
    assert.ok = jest.fn()

    const branches: BranchResponse[] = [
      { branchName: 'branch1', commmitSha: '12345' },
      { branchName: 'branch2', commmitSha: '67890' }
    ]

    github.paginate = jest.fn().mockResolvedValue(branches) as unknown as typeof github.paginate;
    jest.spyOn(require('../../src/functions/check-branch-protection'), "checkBranchProtection").mockImplementation(() => {})

    const branchResponse = await getBranches(true)

    expect(github.paginate).toHaveBeenCalled()
    expect(checkBranchProtection).toHaveBeenCalledWith(branches)
    assert(branchResponse == branches)
  })
})
