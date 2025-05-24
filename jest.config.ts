import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  verbose: true,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/__mocks__/**',
    '!src/types/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testMatch: ['**/*.test.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!@octokit/.*)'
  ],
  moduleNameMapper: {
    '^@octokit/request-error$': '<rootDir>/__mocks__/request-error.ts'
  },
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts']
}

export default config
