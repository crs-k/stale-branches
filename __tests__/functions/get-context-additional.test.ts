import * as core from '@actions/core'
import {validateInputs} from '../../src/functions/get-context'
import {CompareBranchesEnum} from '../../src/enums/input-compare-branches'

jest.mock('@actions/core')
jest.mock('@actions/github', () => ({
  context: {
    repo: {
      owner: 'mockOwner',
      repo: 'mockRepo'
    }
  },
  getOctokit: jest.fn(() => ({}))
}))

describe('get-context additional tests', () => {
  let getInputMock: jest.MockedFunction<typeof core.getInput>
  let getBooleanInputMock: jest.MockedFunction<typeof core.getBooleanInput>
  let setFailedMock: jest.MockedFunction<typeof core.setFailed>

  beforeEach(() => {
    // Set up mocks
    getInputMock = core.getInput as jest.MockedFunction<typeof core.getInput>
    getBooleanInputMock = core.getBooleanInput as jest.MockedFunction<typeof core.getBooleanInput>
    setFailedMock = core.setFailed as jest.MockedFunction<typeof core.setFailed>
    
    // Default input values for most tests
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'days-before-stale':
          return '30'
        case 'days-before-delete':
          return '60'
        case 'max-issues':
          return '25'
        case 'stale-branch-label':
          return 'stale'
        case 'compare-branches':
          return 'off'
        case 'branches-filter-regex':
          return ''
        case 'ignore-commit-messages':
          return ''
        case 'ignore-committers':
          return ''
        case 'ignore-default-branch-commits':
          return ''
        default:
          return ''
      }
    })
    
    getBooleanInputMock.mockImplementation(name => {
      switch (name) {
        case 'comment-updates':
          return true
        case 'tag-committer':
          return true
        case 'rate-limit':
          return true
        case 'pr-check':
          return true
        case 'dry-run':
          return false
        case 'ignore-issue-interaction':
          return false
        case 'include-protected-branches':
          return false
        default:
          return false
      }
    })
  })

  it('handles branches-filter-regex length validation', async () => {
    // Set branches-filter-regex to be too long
    getInputMock.mockImplementation(name => {
      if (name === 'branches-filter-regex') {
        return 'a'.repeat(51) // 51 characters, which is > 50
      }
      // Need to set proper values for days-before-stale and days-before-delete
      switch (name) {
        case 'days-before-stale':
          return '30'
        case 'days-before-delete':
          return '60'
        case 'max-issues':
          return '25'
        case 'stale-branch-label':
          return 'stale'
        case 'compare-branches':
          return 'off'
        default:
          return ''
      }
    })
    
    await validateInputs()
    
    expect(setFailedMock).toHaveBeenCalledWith('Failed to validate inputs. Error: branches-filter-regex must be 50 characters or less')
  })

  it('correctly parses ignore-committers input with multiple values', async () => {
    getInputMock.mockImplementation(name => {
      if (name === 'ignore-committers') {
        return 'user1, user2,user3, , user4'
      }
      
      // Return default values for other inputs
      switch (name) {
        case 'days-before-stale':
          return '30'
        case 'days-before-delete':
          return '60'
        case 'max-issues':
          return '25'
        case 'stale-branch-label':
          return 'stale'
        case 'compare-branches':
          return 'off'
        default:
          return ''
      }
    })
    
    const result = await validateInputs()
    
    expect(result.ignoreCommitters).toEqual(['user1', 'user2', 'user3', 'user4'])
  })

  it('defaults ignoreDefaultBranchCommits to true when ignoreCommitMessages is set', async () => {
    getInputMock.mockImplementation(name => {
      if (name === 'ignore-commit-messages') {
        return 'auto-update,automated'
      }
      if (name === 'ignore-default-branch-commits') {
        return '' // Not explicitly set
      }
      
      // Return default values for other inputs
      switch (name) {
        case 'days-before-stale':
          return '30'
        case 'days-before-delete':
          return '60'
        case 'max-issues':
          return '25'
        case 'stale-branch-label':
          return 'stale'
        case 'compare-branches':
          return 'off'
        default:
          return ''
      }
    })
    
    const result = await validateInputs()
    
    expect(result.ignoreDefaultBranchCommits).toBe(true)
  })

  it('respects explicit ignoreDefaultBranchCommits setting when both are provided', async () => {
    getInputMock.mockImplementation(name => {
      if (name === 'ignore-commit-messages') {
        return 'auto-update,automated'
      }
      if (name === 'ignore-default-branch-commits') {
        return 'false' // Explicitly set to false
      }
      
      // Return default values for other inputs
      switch (name) {
        case 'days-before-stale':
          return '30'
        case 'days-before-delete':
          return '60'
        case 'max-issues':
          return '25'
        case 'stale-branch-label':
          return 'stale'
        case 'compare-branches':
          return 'off'
        default:
          return ''
      }
    })
    
    const result = await validateInputs()
    
    expect(result.ignoreDefaultBranchCommits).toBe(false)
  })

  it('handles TypeErrors gracefully', async () => {
    // Simulate a TypeError by making getBooleanInput throw
    getBooleanInputMock.mockImplementation(() => {
      throw new TypeError('Test error')
    })
    
    await validateInputs()
    
    expect(setFailedMock).toHaveBeenCalledWith('Failed to validate inputs. Error: Test error')
  })

  it('handles non-Error exceptions gracefully', async () => {
    // Simulate a non-Error exception
    getBooleanInputMock.mockImplementation(() => {
      throw 'String error' // eslint-disable-line no-throw-literal
    })
    
    await validateInputs()
    
    expect(setFailedMock).toHaveBeenCalledWith('Failed to validate inputs.')
  })
})
