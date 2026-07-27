"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Sync object
const config = {
    collectCoverageFrom: ["src/**/*.ts"],
    verbose: true,
    clearMocks: true,
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': ['babel-jest', {
            presets: [
                ['@babel/preset-env', {targets: {node: 'current'}}],
                ['@babel/preset-typescript', {allowDeclareFields: true}]
            ]
        }]
    },
    transformIgnorePatterns: [
        'node_modules/(?!@octokit/.*)'
    ],
    moduleNameMapper: {
        '^assert$': '<rootDir>/__mocks__/assert.ts',
        '^@octokit/request-error$': '<rootDir>/__mocks__/request-error.ts'
    }
};
exports.default = config;
