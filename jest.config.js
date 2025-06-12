"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Sync object
const config = {
    collectCoverageFrom: ["*/**/*.ts"],
    verbose: true,
    clearMocks: true,
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    transformIgnorePatterns: [
        'node_modules/(?!@octokit/.*)'
    ],
    moduleNameMapper: {
        '^@octokit/request-error$': '<rootDir>/__mocks__/request-error.ts'
    }
};
exports.default = config;
