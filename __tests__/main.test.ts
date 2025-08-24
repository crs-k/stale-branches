import {run} from '../src/stale-branches'

// Mock the run function
jest.mock('../src/stale-branches', () => ({
  run: jest.fn()
}))

describe('Main Entry Point', () => {
  test('main.ts can be imported without errors', () => {
    expect(() => require('../src/main')).not.toThrow()
  })

  test('main.ts imports the run function', () => {
    // Test that the main module includes the run function import
    const mainContent = require('fs').readFileSync(require.resolve('../src/main'), 'utf8')
    expect(mainContent).toContain("import {run} from './stale-branches'")
    expect(mainContent).toContain('require.main === module')
    expect(mainContent).toContain('run()')
  })

  test('conditionally calls run() based on require.main check', () => {
    // Test that the conditional logic exists without actually triggering it
    const mainContent = require('fs').readFileSync(require.resolve('../src/main'), 'utf8')
    expect(mainContent).toMatch(/if\s*\(\s*require\.main\s*===\s*module\s*\)\s*\{[\s\S]*run\(\)[\s\S]*\}/)
  })
})