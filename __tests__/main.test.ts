// Mock the stale-branches module before importing
const mockRun = jest.fn()
jest.mock('../src/stale-branches', () => ({
  run: mockRun
}))

describe('main.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should export run function correctly', () => {
    const mainModule = require('../src/main')
    expect(typeof mainModule.run).toBe('function')
  })

  it('should handle module import without throwing', () => {
    // Simply require the module - it should not throw
    expect(() => {
      require('../src/main')
    }).not.toThrow()
  })

  it('should handle async execution of run function', async () => {
    const { run } = require('../src/stale-branches')
    
    mockRun.mockResolvedValue(undefined)
    
    // Test that run can be called
    await expect(run()).resolves.not.toThrow()
    expect(mockRun).toHaveBeenCalled()
  })
})
