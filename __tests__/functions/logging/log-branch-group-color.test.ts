import {logBranchGroupColor} from '../../../src/functions/logging/log-branch-group-color'
import styles from 'ansi-styles'

describe('logBranchGroupColor', () => {
  it('returns green color when commit age is less than days before stale', () => {
    const branchName = 'feature/test-branch'
    const commitAge = 5
    const daysBeforeStale = 10
    const daysBeforeDelete = 20
    
    const result = logBranchGroupColor(branchName, commitAge, daysBeforeStale, daysBeforeDelete)
    const expected = `[${styles.greenBright.open}${branchName}${styles.greenBright.close}]`
    
    expect(result).toBe(expected)
  })

  it('returns yellow color when commit age is greater than days before stale but less than days before delete', () => {
    const branchName = 'feature/test-branch'
    const commitAge = 15
    const daysBeforeStale = 10
    const daysBeforeDelete = 20
    
    const result = logBranchGroupColor(branchName, commitAge, daysBeforeStale, daysBeforeDelete)
    const expected = `[${styles.yellowBright.open}${branchName}${styles.yellowBright.close}]`
    
    expect(result).toBe(expected)
  })

  it('returns red color when commit age is greater than days before delete', () => {
    const branchName = 'feature/test-branch'
    const commitAge = 25
    const daysBeforeStale = 10
    const daysBeforeDelete = 20
    
    const result = logBranchGroupColor(branchName, commitAge, daysBeforeStale, daysBeforeDelete)
    const expected = `[${styles.redBright.open}${branchName}${styles.redBright.close}]`
    
    expect(result).toBe(expected)
  })

  it('returns green color for default case when commit age equals days before stale', () => {
    const branchName = 'feature/test-branch'
    const commitAge = 10
    const daysBeforeStale = 10
    const daysBeforeDelete = 20
    
    const result = logBranchGroupColor(branchName, commitAge, daysBeforeStale, daysBeforeDelete)
    const expected = `[${styles.greenBright.open}${branchName}${styles.greenBright.close}]`
    
    expect(result).toBe(expected)
  })

  it('returns yellow color when commit age equals days before delete', () => {
    const branchName = 'feature/test-branch'
    const commitAge = 20
    const daysBeforeStale = 10
    const daysBeforeDelete = 20
    
    const result = logBranchGroupColor(branchName, commitAge, daysBeforeStale, daysBeforeDelete)
    const expected = `[${styles.yellowBright.open}${branchName}${styles.yellowBright.close}]`
    
    expect(result).toBe(expected)
  })

  it('handles edge case where all parameters are equal', () => {
    const branchName = 'feature/test-branch'
    const commitAge = 10
    const daysBeforeStale = 10
    const daysBeforeDelete = 10
    
    const result = logBranchGroupColor(branchName, commitAge, daysBeforeStale, daysBeforeDelete)
    const expected = `[${styles.greenBright.open}${branchName}${styles.greenBright.close}]`
    
    expect(result).toBe(expected)
  })
})