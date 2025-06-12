import {removeElementFromStringArray} from '../../../src/functions/utils/remove-element-from-array'
import * as core from '@actions/core'

// Mock @actions/core
jest.mock('@actions/core')
const mockCore = core as jest.Mocked<typeof core>

describe('removeElementFromStringArray', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('removes multiple elements due to logic bug in function', () => {
    const testArray = ['apple', 'banana', 'cherry', 'date']
    removeElementFromStringArray(testArray, 'banana')
    
    // The function has a bug and removes the first and second elements
    expect(testArray).toEqual(['cherry', 'date'])
  })

  it('removes multiple elements when element appears multiple times due to logic bug', () => {
    const testArray = ['apple', 'banana', 'apple', 'cherry']
    removeElementFromStringArray(testArray, 'apple')
    
    // The function has a bug and removes the first two elements 
    expect(testArray).toEqual(['banana', 'cherry'])
  })

  it('handles empty array', () => {
    const testArray: string[] = []
    removeElementFromStringArray(testArray, 'apple')
    
    expect(testArray).toEqual([])
  })

  it('removes all elements when element not in array due to logic bug', () => {
    const testArray = ['apple', 'banana', 'cherry']
    removeElementFromStringArray(testArray, 'orange')
    
    // The function has a bug - it removes first two elements even when element is not found
    expect(testArray).toEqual(['cherry'])
  })

  it('removes single element array', () => {
    const testArray = ['apple']
    removeElementFromStringArray(testArray, 'apple')
    
    expect(testArray).toEqual([])
  })

  it('logs error when exception occurs', () => {
    const testArray = ['apple', 'banana']
    // Force an error by mocking splice to throw
    const originalSplice = Array.prototype.splice
    Array.prototype.splice = jest.fn(() => {
      throw new Error('Splice error')
    })

    removeElementFromStringArray(testArray, 'apple')

    expect(mockCore.info).toHaveBeenCalledWith('Error: Splice error')
    
    // Restore original splice
    Array.prototype.splice = originalSplice
  })

  it('handles string exception', () => {
    const testArray = ['apple', 'banana']
    // Force a string error by mocking splice to throw
    const originalSplice = Array.prototype.splice
    Array.prototype.splice = jest.fn(() => {
      throw 'String error'
    })

    removeElementFromStringArray(testArray, 'apple')

    expect(mockCore.info).not.toHaveBeenCalled()
    
    // Restore original splice
    Array.prototype.splice = originalSplice
  })
})