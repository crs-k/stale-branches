import {run} from './stale-branches'

// Helper function to check if this is the main module
// This can be mocked in tests to avoid manipulating require.main
export function checkIsMainModule(): boolean {
  return require.main === module
}

if (checkIsMainModule()) {
  run()
}
