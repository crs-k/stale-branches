"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    transformIgnorePatterns: [
        'node_modules/(?!@octokit/.*)'
    ],
    moduleNameMapper: {
        '^@octokit/request-error$': '<rootDir>/__mocks__/request-error.ts'
    },
    setupFilesAfterEnv: [],
    testTimeout: 10000,
    maxWorkers: '50%'
};

exports.default = config;
