import {BranchComparison} from '../../types/branch-comparison'
import styles from 'ansi-styles'

export function logCompareBranches(branchComparison: BranchComparison, base: string, head: string): string {
  //const compareBranches1 = `${styles.bold.open}[${styles.magenta.open}${branchComparison.aheadBy}${styles.magenta.close}] ${styles.blueBright.open}branches found${styles.blueBright.close}.${styles.bold.close}`
  let compareBranches: string
  compareBranches = `${styles.bold.open}${head} is ${branchComparison.branchStatus} ${base} by aheadby: ${branchComparison.aheadBy} behindby: ${branchComparison.behindBy} with ${branchComparison.totalCommits} total commits${styles.bold.close}`
  switch (branchComparison.branchStatus) {
    case 'diverged':
      compareBranches = `${styles.bold.open}${head} is ${branchComparison.branchStatus} ${base} by aheadby: ${branchComparison.aheadBy} behindby: ${branchComparison.behindBy} with ${branchComparison.totalCommits} total commits${styles.bold.close}`
      break
    case 'ahead':
      compareBranches = `${styles.bold.open}${head} is ${branchComparison.branchStatus} ${base} by aheadby: ${branchComparison.aheadBy} behindby: ${branchComparison.behindBy} with ${branchComparison.totalCommits} total commits${styles.bold.close}`
      break
    case 'behind':
      compareBranches = `${styles.bold.open}${head} is ${branchComparison.branchStatus} ${base} by aheadby: ${branchComparison.aheadBy} behindby: ${branchComparison.behindBy} with ${branchComparison.totalCommits} total commits${styles.bold.close}`
      break
    case 'identical':
      compareBranches = `${styles.bold.open}${head} is ${branchComparison.branchStatus} ${base} by aheadby: ${branchComparison.aheadBy} behindby: ${branchComparison.behindBy} with ${branchComparison.totalCommits} total commits${styles.bold.close}`
      break
  }
  return compareBranches
}
