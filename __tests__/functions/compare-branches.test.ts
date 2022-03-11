jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('assert')
jest.mock('../../src/functions/get-context')

const core = require('@actions/core')
const assert = require('assert')
import {compareBranches} from '../../src/functions/compare-branches'
import {github} from '../../src/functions/get-context'

let head = 'headBranch'
let inputCompare = 'off'

describe('Compare Branches Function', () => {
  test('compareCommitsWithBasehead endpoint is called with compare input off', async () => {
    const data = await compareBranches(head, inputCompare)
    expect(github.rest.repos.compareCommitsWithBasehead).toBeCalledTimes(0)
    expect(data).toEqual({save: false})
  })

  test('compareCommitsWithBasehead endpoint is called with compare input info', async () => {
    let inputCompare = 'info'
    const data = await compareBranches(head, inputCompare)
    expect(github.rest.repos.compareCommitsWithBasehead).toHaveBeenCalled()
    expect(data).toEqual({aheadBy: 1, behindBy: 2, branchStatus: 'diverged', save: false, totalCommits: 3})
  })

  test('compareCommitsWithBasehead endpoint is called with compare input save', async () => {
    let inputCompare = 'save'
    const data = await compareBranches(head, inputCompare)
    expect(github.rest.repos.compareCommitsWithBasehead).toHaveBeenCalled()
    expect(data).toEqual({aheadBy: 1, behindBy: 2, branchStatus: 'diverged', save: true, totalCommits: 3})
  })

  test('Action fails elegantly - Error', async () => {
    let inputCompare = 'save'
    core.info = jest.fn()
    assert.ok = jest.fn()
    assert.ok.mockImplementation(() => {
      throw new Error('Branch Comparison Status cannot be empty.')
    })

    await compareBranches(head, inputCompare)
    expect(core.info).toHaveBeenCalledWith(`Failed to retrieve branch comparison data. Error: Branch Comparison Status cannot be empty.`)
  })

  test('Action fails elegantly - String', async () => {
    let inputCompare = 'save'
    core.info = jest.fn()
    assert.ok = jest.fn()
    assert.ok.mockImplementation(() => {
      throw new String('Branch Comparison Status cannot be empty.')
    })

    await compareBranches(head, inputCompare)
    expect(core.info).toHaveBeenCalledWith(`Failed to retrieve branch comparison data.`)
  })
})
