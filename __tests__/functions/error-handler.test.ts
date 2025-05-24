import * as core from '@actions/core'
import {
  StaleBranchesError,
  RateLimitError,
  GitHubAPIError,
  ValidationError,
  handleError,
  withErrorHandling,
  assertExists,
  assertPositiveNumber
} from '../../src/functions/error-handler'

// Mock dependencies
jest.mock('@actions/core')

const mockCore = core as jest.Mocked<typeof core>

// Mock process.exit to prevent test from actually exiting
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
  throw new Error('process.exit called')
})

describe('Error Handler Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    mockExit.mockRestore()
  })

  describe('StaleBranchesError', () => {
    it('should create error with message and code', () => {
      const error = new StaleBranchesError('Test message', 'TEST_CODE')
      
      expect(error.message).toBe('Test message')
      expect(error.code).toBe('TEST_CODE')
      expect(error.name).toBe('StaleBranchesError')
      expect(error.context).toBeUndefined()
    })

    it('should create error with context', () => {
      const context = { branch: 'test-branch', age: 10 }
      const error = new StaleBranchesError('Test message', 'TEST_CODE', context)
      
      expect(error.message).toBe('Test message')
      expect(error.code).toBe('TEST_CODE')
      expect(error.name).toBe('StaleBranchesError')
      expect(error.context).toEqual(context)
    })
  })

  describe('RateLimitError', () => {
    it('should create rate limit error', () => {
      const error = new RateLimitError('Rate limit exceeded')
      
      expect(error.message).toBe('Rate limit exceeded')
      expect(error.code).toBe('RATE_LIMIT_EXCEEDED')
      expect(error.name).toBe('RateLimitError')
    })

    it('should create rate limit error with context', () => {
      const context = { used: 96, remaining: 4 }
      const error = new RateLimitError('Rate limit exceeded', context)
      
      expect(error.message).toBe('Rate limit exceeded')
      expect(error.code).toBe('RATE_LIMIT_EXCEEDED')
      expect(error.name).toBe('RateLimitError')
      expect(error.context).toEqual(context)
    })
  })

  describe('GitHubAPIError', () => {
    it('should create GitHub API error', () => {
      const error = new GitHubAPIError('API call failed')
      
      expect(error.message).toBe('API call failed')
      expect(error.code).toBe('GITHUB_API_ERROR')
      expect(error.name).toBe('GitHubAPIError')
    })
  })

  describe('ValidationError', () => {
    it('should create validation error', () => {
      const error = new ValidationError('Invalid input')
      
      expect(error.message).toBe('Invalid input')
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.name).toBe('ValidationError')
    })
  })

  describe('handleError', () => {
    it('should handle StaleBranchesError without context', () => {
      const error = new StaleBranchesError('Test error', 'TEST_CODE')
      
      expect(() => handleError(error)).toThrow('process.exit called')
      
      expect(mockCore.error).toHaveBeenCalledWith('StaleBranchesError: Test error')
      expect(mockCore.setFailed).toHaveBeenCalledWith('Action failed: Test error')
    })

    it('should handle StaleBranchesError with context', () => {
      const context = { branch: 'test-branch' }
      const error = new StaleBranchesError('Test error', 'TEST_CODE', context)
      
      expect(() => handleError(error)).toThrow('process.exit called')
      
      expect(mockCore.error).toHaveBeenCalledWith('StaleBranchesError: Test error')
      expect(mockCore.error).toHaveBeenCalledWith(`Context: ${JSON.stringify(context, null, 2)}`)
      expect(mockCore.setFailed).toHaveBeenCalledWith('Action failed: Test error')
    })

    it('should handle RateLimitError', () => {
      const error = new RateLimitError('Rate limit exceeded')
      
      expect(() => handleError(error)).toThrow('process.exit called')
      
      expect(mockCore.error).toHaveBeenCalledWith('RateLimitError: Rate limit exceeded')
      expect(mockCore.setFailed).toHaveBeenCalledWith('Action failed: Rate limit exceeded')
    })

    it('should handle regular Error', () => {
      const error = new Error('Regular error')
      error.stack = 'Error stack trace'
      
      expect(() => handleError(error)).toThrow('process.exit called')
      
      expect(mockCore.error).toHaveBeenCalledWith('Unexpected error: Regular error')
      expect(mockCore.error).toHaveBeenCalledWith('Stack trace: Error stack trace')
      expect(mockCore.setFailed).toHaveBeenCalledWith('Action failed with unexpected error: Regular error')
    })

    it('should handle non-Error objects', () => {
      const error = 'String error'
      
      expect(() => handleError(error)).toThrow('process.exit called')
      
      expect(mockCore.error).toHaveBeenCalledWith('Unknown error occurred: String error')
      expect(mockCore.setFailed).toHaveBeenCalledWith('Action failed with unknown error')
    })
  })

  describe('withErrorHandling', () => {
    it('should execute function successfully', async () => {
      const testFn = jest.fn().mockResolvedValue('success')
      const wrappedFn = withErrorHandling(testFn)
      
      const result = await wrappedFn('arg1', 'arg2')
      
      expect(result).toBe('success')
      expect(testFn).toHaveBeenCalledWith('arg1', 'arg2')
    })

    it('should handle function errors', async () => {
      const testError = new Error('Test error')
      const testFn = jest.fn().mockRejectedValue(testError)
      const wrappedFn = withErrorHandling(testFn)
      
      await expect(() => wrappedFn('arg1')).rejects.toThrow('process.exit called')
      
      expect(testFn).toHaveBeenCalledWith('arg1')
      expect(mockCore.error).toHaveBeenCalledWith('Unexpected error: Test error')
    })
  })

  describe('assertExists', () => {
    it('should pass for valid values', () => {
      expect(() => assertExists('valid string', 'test value')).not.toThrow()
      expect(() => assertExists(0, 'zero value')).not.toThrow()
      expect(() => assertExists(false, 'false value')).not.toThrow()
      expect(() => assertExists([], 'empty array')).not.toThrow()
    })

    it('should throw ValidationError for null', () => {
      expect(() => assertExists(null, 'test value')).toThrow(ValidationError)
      expect(() => assertExists(null, 'test value')).toThrow('test value')
    })

    it('should throw ValidationError for undefined', () => {
      expect(() => assertExists(undefined, 'test value')).toThrow(ValidationError)
      expect(() => assertExists(undefined, 'test value')).toThrow('test value')
    })
  })

  describe('assertPositiveNumber', () => {
    it('should pass for positive numbers', () => {
      expect(() => assertPositiveNumber(1, 'test field')).not.toThrow()
      expect(() => assertPositiveNumber(0.5, 'test field')).not.toThrow()
      expect(() => assertPositiveNumber(100, 'test field')).not.toThrow()
    })

    it('should throw ValidationError for zero', () => {
      expect(() => assertPositiveNumber(0, 'test field')).toThrow(ValidationError)
      expect(() => assertPositiveNumber(0, 'test field')).toThrow('test field must be a positive number, got: 0')
    })

    it('should throw ValidationError for negative numbers', () => {
      expect(() => assertPositiveNumber(-1, 'test field')).toThrow(ValidationError)
      expect(() => assertPositiveNumber(-1, 'test field')).toThrow('test field must be a positive number, got: -1')
    })

    it('should throw ValidationError for NaN', () => {
      expect(() => assertPositiveNumber(NaN, 'test field')).toThrow(ValidationError)
      expect(() => assertPositiveNumber(NaN, 'test field')).toThrow('test field must be a positive number, got: NaN')
    })
  })
})
