// Global test setup
jest.setTimeout(30000)

// Mock environment variables for tests
process.env.GITHUB_REPOSITORY = 'test/repo'
process.env.GITHUB_TOKEN = 'test-token'
process.env.GITHUB_WORKSPACE = '/github/workspace'
