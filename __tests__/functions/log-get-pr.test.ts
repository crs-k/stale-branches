import {logGetPr} from '../../src/functions/logging/log-get-pr'

describe('Log Get PR Function', () => {
  test('should return formatted string for pull requests', () => {
    const result = logGetPr(2)
    expect(result).toContain('2')
    expect(result).toContain('pull requests found')
  })
})
