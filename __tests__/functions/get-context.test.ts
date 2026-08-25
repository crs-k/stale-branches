jest.mock('@actions/core')
const core = require('@actions/core')
import {github, owner, repo, validateInputs} from '../../src/functions/get-context'

describe('Get Context Function', () => {
  test('Mock context check', async () => {
    expect(github).toBeTruthy
    expect(owner).toBe('owner')
    expect(repo).toBe('repo')
  })

  test('Expect Failure: days-before-stale cannot be greater than or equal to days-before-delete', async () => {
    core.setFailed = jest.fn()
    core.getInput = jest
      .fn()
      .mockReturnValueOnce(5) // days-before-stale
      .mockReturnValueOnce(0) // days-before-delete
      .mockReturnValueOnce(20) // max-issues
      .mockReturnValueOnce('Stale Branch Label') // stale-branch-label
      .mockReturnValueOnce('save') // compare-branches
    await validateInputs()

    expect(core.setFailed).toHaveBeenCalledWith('Failed to validate inputs. Error: days-before-stale cannot be greater than or equal to days-before-delete')
  })

  test('Expect Failure: days-before-stale must be a number', async () => {
    core.setFailed = jest.fn()
    core.getInput = jest
      .fn()
      .mockReturnValueOnce('A') // days-before-stale
      .mockReturnValueOnce('5') // days-before-delete
      .mockReturnValueOnce(20) // max-issues
      .mockReturnValueOnce('Stale Branch Label') // stale-branch-label
      .mockReturnValueOnce('save') // compare-branches
    await validateInputs()

    expect(core.setFailed).toHaveBeenCalledWith('Failed to validate inputs. Error: days-before-stale must be a number')
  })

  test('Expect Failure: days-before-delete must be a number', async () => {
    core.setFailed = jest.fn()
    core.getInput = jest
      .fn()
      .mockReturnValueOnce('0') // days-before-stale
      .mockReturnValueOnce('B') // days-before-delete
      .mockReturnValueOnce(20) // max-issues
      .mockReturnValueOnce('Stale Branch Label') // stale-branch-label
      .mockReturnValueOnce('save') // compare-branches
    await validateInputs()

    expect(core.setFailed).toHaveBeenCalledWith('Failed to validate inputs. Error: days-before-delete must be a number')
  })

  test('Expect Failure: days-before-stale must be greater than zero', async () => {
    core.setFailed = jest.fn()
    core.getInput = jest
      .fn()
      .mockReturnValueOnce('-1') // days-before-stale
      .mockReturnValueOnce('0') // days-before-delete
      .mockReturnValueOnce(20) // max-issues
      .mockReturnValueOnce('Stale Branch Label') // stale-branch-label
      .mockReturnValueOnce('save') // compare-branches
    await validateInputs()

    expect(core.setFailed).toHaveBeenCalledWith('Failed to validate inputs. Error: days-before-stale must be greater than zero')
  })

  test('Expect Failure: max-issues must be a number', async () => {
    core.setFailed = jest.fn()
    core.getInput = jest
      .fn()
      .mockReturnValueOnce('1') // days-before-stale
      .mockReturnValueOnce('5') // days-before-delete
      .mockReturnValueOnce('NaN') // max-issues
      .mockReturnValueOnce('Stale Branch Label') // stale-branch-label
      .mockReturnValueOnce('save') // compare-branches
    await validateInputs()

    expect(core.setFailed).toHaveBeenCalledWith('Failed to validate inputs. Error: max-issues must be a number')
  })

  test('Expect Failure: max-issues must be greater than zero', async () => {
    core.setFailed = jest.fn()
    core.getInput = jest
      .fn()
      .mockReturnValueOnce('1') // days-before-stale
      .mockReturnValueOnce('5') // days-before-delete
      .mockReturnValueOnce('-5') // max-issues
      .mockReturnValueOnce('Stale Branch Label') // stale-branch-label
      .mockReturnValueOnce('save') // compare-branches
    await validateInputs()

    expect(core.setFailed).toHaveBeenCalledWith('Failed to validate inputs. Error: max-issues must be greater than zero')
  })

  test('Expect Failure: stale-branch-label must be 50 characters or less', async () => {
    core.setFailed = jest.fn()
    core.getInput = jest
      .fn()
      .mockReturnValueOnce('1') // days-before-stale
      .mockReturnValueOnce('5') // days-before-delete
      .mockReturnValueOnce('5') // max-issues
      .mockReturnValueOnce('Stale Branch Label Stale Branch Label Stale Branch Label') // stale-branch-label
      .mockReturnValueOnce('save') // compare-branches
    await validateInputs()

    expect(core.setFailed).toHaveBeenCalledWith('Failed to validate inputs. Error: stale-branch-label must be 50 characters or less')
  })

  test(`Expect Failure: compare-branches input of 'bleh' is not valid.`, async () => {
    core.setFailed = jest.fn()
    core.getInput = jest
      .fn()
      .mockReturnValueOnce('1') // days-before-stale
      .mockReturnValueOnce('5') // days-before-delete
      .mockReturnValueOnce('5') // max-issues
      .mockReturnValueOnce('Stale Branch Label') // stale-branch-label
      .mockReturnValueOnce('bleh') // compare-branches
    await validateInputs()

    expect(core.setFailed).toHaveBeenCalledWith(`Failed to validate inputs. Error: compare-branches input of 'bleh' is not valid.`)
  })

  test('Expect Success: Proper Inputs with ignore-commit-messages', async () => {
    core.setFailed = jest.fn()
    core.getBooleanInput = jest.fn().mockReturnValueOnce(true).mockReturnValueOnce(true)
    core.getInput = jest
      .fn()
      .mockReturnValueOnce('1') // days-before-stale
      .mockReturnValueOnce('5') // days-before-delete
      .mockReturnValueOnce('5') // max-issues
      .mockReturnValueOnce('Stale Branch Label') // stale-branch-label
      .mockReturnValueOnce('save') // compare-branches
      .mockReturnValueOnce('^((?!dependabot).)*$') // branches-filter-regex
      .mockReturnValueOnce('skip this message') // ignore-commit-messages
    await validateInputs()

    expect(core.getInput).toHaveBeenCalledTimes(9)
    expect(core.getBooleanInput).toHaveBeenCalledTimes(8)
    expect(core.getInput).toHaveBeenCalledWith('ignore-commit-messages')
  })

  test('Expect Failure: - TypeError', async () => {
    core.setFailed = jest.fn()
    core.getInput = jest
      .fn()
      .mockReturnValueOnce('1') // days-before-stale
      .mockReturnValueOnce('5') // days-before-delete
      .mockReturnValueOnce('5') // max-issues
      .mockReturnValueOnce('Stale Branch Label') // stale-branch-label
      .mockReturnValueOnce('save') // compare-branches
    core.getBooleanInput = jest.fn()
    core.getBooleanInput.mockImplementation(() => {
      throw new TypeError('TypeError')
    })

    await validateInputs()
    expect(core.setFailed).toHaveBeenCalledWith(`Failed to validate inputs. Error: TypeError`)
  })

  test('Expect Failure: - String', async () => {
    core.setFailed = jest.fn()
    core.getInput = jest
      .fn()
      .mockReturnValueOnce('1') // days-before-stale
      .mockReturnValueOnce('5') // days-before-delete
      .mockReturnValueOnce('5') // max-issues
      .mockReturnValueOnce('Stale Branch Label') // stale-branch-label
      .mockReturnValueOnce('save') // compare-branches
    core.getBooleanInput = jest.fn().mockReturnValueOnce(true)
    core.getBooleanInput.mockImplementation(() => {
      throw new String('String')
    })

    await validateInputs()
    expect(core.setFailed).toHaveBeenCalledWith(`Failed to validate inputs.`)
  })

  test('Expect Failure: branches-filter-regex must be 50 characters or less', async () => {
    core.setFailed = jest.fn()
    const longRegex = 'a'.repeat(51) // 51 characters
    core.getBooleanInput = jest.fn().mockReturnValue(true)
    core.getInput = jest
      .fn()
      .mockReturnValueOnce('1') // days-before-stale
      .mockReturnValueOnce('5') // days-before-delete
      .mockReturnValueOnce('5') // max-issues
      .mockReturnValueOnce('Stale Branch Label') // stale-branch-label
      .mockReturnValueOnce('save') // compare-branches
      .mockReturnValueOnce(longRegex) // branches-filter-regex (too long)
      .mockReturnValueOnce('') // ignore-commit-messages
      .mockReturnValueOnce('') // ignore-committers
      .mockReturnValueOnce('') // ignore-default-branch-commits
    
    await validateInputs()
    expect(core.setFailed).toHaveBeenCalledWith('Failed to validate inputs. Error: branches-filter-regex must be 50 characters or less')
  })

  test('Expect Success: With ignore-committers and explicit ignore-default-branch-commits', async () => {
    core.setFailed = jest.fn()
    core.getBooleanInput = jest.fn().mockReturnValue(true)
    core.getInput = jest
      .fn()
      .mockReturnValueOnce('1') // days-before-stale
      .mockReturnValueOnce('5') // days-before-delete
      .mockReturnValueOnce('5') // max-issues
      .mockReturnValueOnce('Stale Branch Label') // stale-branch-label
      .mockReturnValueOnce('save') // compare-branches
      .mockReturnValueOnce('') // branches-filter-regex
      .mockReturnValueOnce('skip this message') // ignore-commit-messages
      .mockReturnValueOnce('user1, user2, user3') // ignore-committers
      .mockReturnValueOnce('false') // ignore-default-branch-commits (explicit false)
    
    const result = await validateInputs()
    expect(result.ignoreCommitters).toEqual(['user1', 'user2', 'user3'])
    expect(result.ignoreDefaultBranchCommits).toBe(false)
  })

  test('Expect Success: Without ignore-commit-messages sets ignore-default-branch-commits to false', async () => {
    core.setFailed = jest.fn()
    core.getBooleanInput = jest.fn().mockReturnValue(true)
    core.getInput = jest
      .fn()
      .mockReturnValueOnce('1') // days-before-stale
      .mockReturnValueOnce('5') // days-before-delete
      .mockReturnValueOnce('5') // max-issues
      .mockReturnValueOnce('Stale Branch Label') // stale-branch-label
      .mockReturnValueOnce('save') // compare-branches
      .mockReturnValueOnce('') // branches-filter-regex
      .mockReturnValueOnce('') // ignore-commit-messages (empty)
      .mockReturnValueOnce('') // ignore-committers (empty)
      .mockReturnValueOnce('') // ignore-default-branch-commits (empty)
    
    const result = await validateInputs()
    expect(result.ignoreDefaultBranchCommits).toBe(false)
  })
})

describe('resolveRepository (repository input)', () => {
  afterEach(() => {
    jest.dontMock('@actions/core')
    jest.resetModules()
  })

  // Re-mocks '@actions/core' (in its own reset module registry) so a fresh
  // require of get-context picks up a specific `repository` input value -
  // owner/repo are computed once at module load, so this is the only way to
  // exercise resolveRepository() with different inputs.
  function loadWithRepositoryInput(repositoryValue: string): {owner: string; repo: string; setFailed: jest.Mock} {
    const setFailed = jest.fn()
    jest.resetModules()
    jest.doMock('@actions/core', () => ({
      getInput: jest.fn((name: string) => (name === 'repository' ? repositoryValue : 'token')),
      getBooleanInput: jest.fn(),
      setSecret: jest.fn(),
      setFailed
    }))
    const mod = require('../../src/functions/get-context')
    return {owner: mod.owner, repo: mod.repo, setFailed}
  }

  test('falls back to context.repo when repository input is empty', () => {
    const {owner, repo, setFailed} = loadWithRepositoryInput('')

    expect(owner).toBe('owner')
    expect(repo).toBe('repo')
    expect(setFailed).not.toHaveBeenCalled()
  })

  test('overrides owner/repo when a valid repository input is provided', () => {
    const {owner, repo, setFailed} = loadWithRepositoryInput('octocat/Hello-World')

    expect(owner).toBe('octocat')
    expect(repo).toBe('Hello-World')
    expect(setFailed).not.toHaveBeenCalled()
  })

  test('falls back to context.repo and fails when repository input is missing a segment', () => {
    const {owner, repo, setFailed} = loadWithRepositoryInput('not-a-valid-repo')

    expect(owner).toBe('owner')
    expect(repo).toBe('repo')
    expect(setFailed).toHaveBeenCalledWith(`repository input 'not-a-valid-repo' is not valid. Expected 'owner/repo'.`)
  })

  test('falls back to context.repo and fails when repository input has too many segments', () => {
    const {owner, repo, setFailed} = loadWithRepositoryInput('owner/repo/extra')

    expect(owner).toBe('owner')
    expect(repo).toBe('repo')
    expect(setFailed).toHaveBeenCalledWith(`repository input 'owner/repo/extra' is not valid. Expected 'owner/repo'.`)
  })
})
