import {BranchComparison} from '../../types/branch-comparison'
import styles from 'ansi-styles'

export function logCompareBranches(branchComparison: BranchComparison, base: string, head: string): string {
  //const compareBranches1 = `${styles.bold.open}[${styles.magenta.open}${branchComparison.aheadBy}${styles.magenta.close}] ${styles.blueBright.open}branches found${styles.blueBright.close}.${styles.bold.close}`
  const compareBranches = `${styles.bold.open}${head} is ${branchComparison.branchStatus} ${base} by aheadby: ${branchComparison.aheadBy} behindby: ${branchComparison.behindBy} with ${branchComparison.totalCommits} total commits${styles.bold.close}`
  return compareBranches
}
