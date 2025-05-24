"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.GitHubAPIError = exports.RateLimitError = exports.StaleBranchesError = void 0;
exports.handleError = handleError;
exports.withErrorHandling = withErrorHandling;
exports.assertExists = assertExists;
exports.assertPositiveNumber = assertPositiveNumber;
const core = __importStar(require("@actions/core"));
/**
 * Custom error types for better error handling
 */
class StaleBranchesError extends Error {
    constructor(message, code, context) {
        super(message);
        this.code = code;
        this.context = context;
        this.name = 'StaleBranchesError';
    }
}
exports.StaleBranchesError = StaleBranchesError;
class RateLimitError extends StaleBranchesError {
    constructor(message, context) {
        super(message, 'RATE_LIMIT_EXCEEDED', context);
        this.name = 'RateLimitError';
    }
}
exports.RateLimitError = RateLimitError;
class GitHubAPIError extends StaleBranchesError {
    constructor(message, context) {
        super(message, 'GITHUB_API_ERROR', context);
        this.name = 'GitHubAPIError';
    }
}
exports.GitHubAPIError = GitHubAPIError;
class ValidationError extends StaleBranchesError {
    constructor(message, context) {
        super(message, 'VALIDATION_ERROR', context);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
/**
 * Enhanced error handler with structured logging
 */
function handleError(error) {
    if (error instanceof StaleBranchesError) {
        core.error(`${error.name}: ${error.message}`);
        if (error.context) {
            core.error(`Context: ${JSON.stringify(error.context, null, 2)}`);
        }
        core.setFailed(`Action failed: ${error.message}`);
    }
    else if (error instanceof Error) {
        core.error(`Unexpected error: ${error.message}`);
        core.error(`Stack trace: ${error.stack}`);
        core.setFailed(`Action failed with unexpected error: ${error.message}`);
    }
    else {
        core.error(`Unknown error occurred: ${String(error)}`);
        core.setFailed('Action failed with unknown error');
    }
    process.exit(1);
}
/**
 * Wraps async functions with error handling
 */
function withErrorHandling(fn) {
    return async (...args) => {
        try {
            return await fn(...args);
        }
        catch (error) {
            handleError(error);
        }
    };
}
/**
 * Validates that a value is not null or undefined
 */
function assertExists(value, message) {
    if (value === null || value === undefined) {
        throw new ValidationError(message);
    }
}
/**
 * Validates that a number is positive
 */
function assertPositiveNumber(value, fieldName) {
    if (isNaN(value) || value <= 0) {
        throw new ValidationError(`${fieldName} must be a positive number, got: ${value}`);
    }
}
//# sourceMappingURL=error-handler.js.map