jest.mock('@actions/core')
const core = require('@actions/core')
import {github, owner, repo,validateInputs} from '../../src/functions/get-context'

describe('Get Context Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
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
    await validateInputs()

    expect(core.setFailed).toHaveBeenCalledWith('days-before-stale cannot be greater than or equal to days-before-delete')
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
    await validateInputs()

    expect(core.setFailed).toHaveBeenCalledWith('days-before-stale must be a number')
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
    await validateInputs()

    expect(core.setFailed).toHaveBeenCalledWith('days-before-delete must be a number')
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
    await validateInputs()

    expect(core.setFailed).toHaveBeenCalledWith('days-before-stale must be greater than zero')
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
    await validateInputs()

    expect(core.setFailed).toHaveBeenCalledWith('max-issues must be a number')
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
    await validateInputs()

    expect(core.setFailed).toHaveBeenCalledWith('max-issues must be greater than zero')
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
    await validateInputs()

    expect(core.setFailed).toHaveBeenCalledWith('stale-branch-label must be 50 characters or less')
    expect(core.setFailed).toHaveBeenCalledWith('Failed to validate inputs. Error: stale-branch-label must be 50 characters or less')
  })



})
