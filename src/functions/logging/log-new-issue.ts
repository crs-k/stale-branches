import {createIssueTitleString} from '../utils/create-issues-title-string'
import styles from 'ansi-styles'

export function logNewIssue(branchName: string): string {
  const issueTitleString = createIssueTitleString(branchName)
  const newIssue = `${styles.bold.open}New issue created:${styles.bold.close} ${styles.magentaBright.open}${issueTitleString}${styles.magentaBright.close}.`

  return newIssue
}
