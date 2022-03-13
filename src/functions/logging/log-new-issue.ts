import {createIssueTitle} from '../utils/create-issues-title'
import styles from 'ansi-styles'

export function logNewIssue(branchName): string {
  const issueTitleString = createIssueTitle(branchName)
  const newIssue = `${styles.bold.open}New issue created:${styles.bold.close} ${styles.magentaBright.open}${issueTitleString}${styles.magentaBright.close}.`

  return newIssue
}
