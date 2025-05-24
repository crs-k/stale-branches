import * as core from '@actions/core'

/**
 * Removes an element from a string array
 *
 * @param {string[]} stringArray The array to assess
 *
 * @param {string} element The element to remove
 */
export function removeElementFromStringArray(stringArray: string[], element: string): void {
  try {
    const index = stringArray.indexOf(element)
    if (index !== -1) {
      stringArray.splice(index, 1)
    }
  } catch (err) {
    if (err instanceof Error) core.info(`Error: ${err.message}`)
    else core.info(`Error removing element from array`)
  }
}
