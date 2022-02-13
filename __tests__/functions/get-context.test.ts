jest.mock('@actions/core')
import {github,owner, repo} from '../../src/functions/get-context'

describe('Get Context Function', () => {
  
  test('Mock context check', async () => {
    expect(github).toBeTruthy
    expect(owner).toBe('owner')
    expect(repo).toBe('repo')
  })
})
