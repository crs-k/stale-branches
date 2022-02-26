import * as core from '@actions/core'

export function removeElementFromStringArray(stringArray: string[], element: string): void {
  try {
    let index = 0
    for (const value of stringArray) {
      if (value === element) index = stringArray.indexOf(value)
      stringArray.splice(index, 1)
    }
  } catch (err) {
    if (err instanceof Error) core.info(`Error: ${err.message}`)
  }
}
