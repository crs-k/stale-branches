import {BranchComparison} from '../../types/branch-comparison'
import styles from 'ansi-styles'

export function logCompareBranches(branchComparison: BranchComparison, base: string, head: string): string {
  let compareBranches: string
  compareBranches = `${styles.bold.open}${head} has a status of [${branchComparison.branchStatus}] in comparison to ${base}. ${head} is ahead by ${branchComparison.aheadBy} commits and behind by ${branchComparison.behindBy} commits.${styles.bold.close}`
  switch (branchComparison.branchStatus) {
    case 'diverged':
      compareBranches = `${styles.bold.open}${head} has ${styles.red.open}diverged${styles.red.close} from ${base}, and is ahead by ${styles.magenta.open}${branchComparison.aheadBy}${styles.magenta.close} commits and behind by ${styles.magenta.open}${branchComparison.behindBy}${styles.magenta.close} commits.${styles.bold.close}`
      break
    case 'ahead':
      compareBranches = `${styles.bold.open}${head} is ${styles.yellow.open}ahead${styles.yellow.close} of ${base} by ${styles.magenta.open}${branchComparison.aheadBy}${styles.magenta.close} commits.${styles.bold.close}`
      break
    case 'behind':
      compareBranches = `${styles.bold.open}${head} is ${styles.yellow.open}behind${styles.yellow.close} ${base} by ${styles.magenta.open}${branchComparison.behindBy}${styles.magenta.close} commits.${styles.bold.close}`
      break
    case 'identical':
      compareBranches = `${styles.bold.open}${head} is ${styles.green.open}identical${styles.green.close} to ${base}.${styles.bold.close}`
      break
  }
  return compareBranches
}
