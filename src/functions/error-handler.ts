import * as core from '@actions/core'

/**
 * Custom error types for better error handling
 */
export class StaleBranchesError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'StaleBranchesError'
  }
}

export class RateLimitError extends StaleBranchesError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'RATE_LIMIT_EXCEEDED', context)
    this.name = 'RateLimitError'
  }
}

export class GitHubAPIError extends StaleBranchesError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'GITHUB_API_ERROR', context)
    this.name = 'GitHubAPIError'
  }
}

export class ValidationError extends StaleBranchesError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', context)
    this.name = 'ValidationError'
  }
}

/**
 * Enhanced error handler with structured logging
 */
export function handleError(error: unknown): never {
  if (error instanceof StaleBranchesError) {
    core.error(`${error.name}: ${error.message}`)
    if (error.context) {
      core.error(`Context: ${JSON.stringify(error.context, null, 2)}`)
    }
    core.setFailed(`Action failed: ${error.message}`)
  } else if (error instanceof Error) {
    core.error(`Unexpected error: ${error.message}`)
    core.error(`Stack trace: ${error.stack}`)
    core.setFailed(`Action failed with unexpected error: ${error.message}`)
  } else {
    core.error(`Unknown error occurred: ${String(error)}`)
    core.setFailed('Action failed with unknown error')
  }

  process.exit(1)
}

/**
 * Wraps async functions with error handling
 */
export function withErrorHandling<T extends unknown[], R>(fn: (...args: T) => Promise<R>): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      handleError(error)
    }
  }
}

/**
 * Validates that a value is not null or undefined
 */
export function assertExists<T>(value: T | null | undefined, message: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new ValidationError(message)
  }
}

/**
 * Validates that a number is positive
 */
export function assertPositiveNumber(value: number, fieldName: string): asserts value is number {
  if (isNaN(value) || value <= 0) {
    throw new ValidationError(`${fieldName} must be a positive number, got: ${value}`)
  }
}
