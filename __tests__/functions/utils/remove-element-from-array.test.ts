import * as core from '@actions/core'
import {removeElementFromStringArray} from '../../../src/functions/utils/remove-element-from-array'

// Mock core.info
jest.mock('@actions/core', () => ({
  info: jest.fn()
}))

describe('removeElementFromStringArray', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('removes an element from the array', () => {
    const testArray = ['one', 'two', 'three']
    removeElementFromStringArray(testArray, 'two')
    expect(testArray).toEqual(['one', 'three'])
  })

  it('does nothing when element is not in array', () => {
    const testArray = ['one', 'two', 'three']
    removeElementFromStringArray(testArray, 'four')
    expect(testArray).toEqual(['one', 'two', 'three'])
  })

  it('removes only the first occurrence of an element', () => {
    const testArray = ['one', 'two', 'two', 'three']
    removeElementFromStringArray(testArray, 'two')
    expect(testArray).toEqual(['one', 'two', 'three'])
  })

  it('handles empty arrays gracefully', () => {
    const testArray: string[] = []
    removeElementFromStringArray(testArray, 'anything')
    expect(testArray).toEqual([])
  })

  it('handles errors gracefully', () => {
    const testArray = null as unknown as string[]
    
    // This should not throw but log the error
    removeElementFromStringArray(testArray, 'test')
    
    expect(core.info).toHaveBeenCalled()
  })
})
