/**
 * Custom error types for better error handling
 */
export declare class StaleBranchesError extends Error {
    readonly code: string;
    readonly context?: Record<string, unknown> | undefined;
    constructor(message: string, code: string, context?: Record<string, unknown> | undefined);
}
export declare class RateLimitError extends StaleBranchesError {
    constructor(message: string, context?: Record<string, unknown>);
}
export declare class GitHubAPIError extends StaleBranchesError {
    constructor(message: string, context?: Record<string, unknown>);
}
export declare class ValidationError extends StaleBranchesError {
    constructor(message: string, context?: Record<string, unknown>);
}
/**
 * Enhanced error handler with structured logging
 */
export declare function handleError(error: unknown): never;
/**
 * Wraps async functions with error handling
 */
export declare function withErrorHandling<T extends unknown[], R>(fn: (...args: T) => Promise<R>): (...args: T) => Promise<R>;
/**
 * Validates that a value is not null or undefined
 */
export declare function assertExists<T>(value: T | null | undefined, message: string): asserts value is T;
/**
 * Validates that a number is positive
 */
export declare function assertPositiveNumber(value: number, fieldName: string): asserts value is number;
