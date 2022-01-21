"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Sync object
const config = {
    verbose: true,
    clearMocks: true,
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
};
exports.default = config;
