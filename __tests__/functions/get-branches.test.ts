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
    await getBranches()

    expect(github.paginate).toHaveBeenCalled()
    expect(core.info).toHaveBeenCalledWith(
      `${styles.bold.open}[${styles.magenta.open}6${styles.magenta.close}] ${styles.blueBright.open}branches found${styles.blueBright.close}.${styles.bold.close}`
    )
    expect(assert.ok).toHaveBeenCalled()
  })

  test('Action fails elegantly - Error', async () => {
    core.setFailed = jest.fn()
    assert.ok = jest.fn()
    assert.ok.mockImplementation(() => {
      throw new Error('Response cannot be empty.')
    })

    await getBranches()
    expect(core.setFailed).toHaveBeenCalledWith(`Failed to retrieve branches for repo. Error: Response cannot be empty.`)
  })

  test('Action fails elegantly - String', async () => {
    core.setFailed = jest.fn()
    assert.ok = jest.fn()
    assert.ok.mockImplementation(() => {
      throw new String('Response cannot be empty.')
    })

    await getBranches()
    expect(core.setFailed).toHaveBeenCalledWith(`Failed to retrieve branches for repo.`)
  })
})
