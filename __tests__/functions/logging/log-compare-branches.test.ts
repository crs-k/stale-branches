import {logCompareBranches} from '../../../src/functions/logging/log-compare-branches'
import styles from 'ansi-styles'

describe('logCompareBranches', () => {
  it('returns formatted message for diverged branches', () => {
    const branchComparison = {
      aheadBy: 5,
      behindBy: 3,
      branchStatus: 'diverged',
      save: false,
      totalCommits: 8
    }
    
    const result = logCompareBranches(branchComparison, 'main', 'feature-branch')
    
    expect(result).toContain('diverged')
    expect(result).toContain('ahead by')
    expect(result).toContain('5')
    expect(result).toContain('behind by')
    expect(result).toContain('3')
  })

  it('returns formatted message for ahead branches', () => {
    const branchComparison = {
      aheadBy: 5,
      behindBy: 0,
      branchStatus: 'ahead',
      save: false,
      totalCommits: 5
    }
    
    const result = logCompareBranches(branchComparison, 'main', 'feature-branch')
    
    expect(result).toContain('ahead')
    expect(result).toContain('5')
    expect(result).not.toContain('behind by')
  })

  it('returns formatted message for behind branches', () => {
    const branchComparison = {
      aheadBy: 0,
      behindBy: 3,
      branchStatus: 'behind',
      save: false,
      totalCommits: 3
    }
    
    const result = logCompareBranches(branchComparison, 'main', 'feature-branch')
    
    expect(result).toContain('behind')
    expect(result).toContain('3')
    expect(result).not.toContain('ahead by')
  })

  it('returns formatted message for identical branches', () => {
    const branchComparison = {
      aheadBy: 0,
      behindBy: 0,
      branchStatus: 'identical',
      save: false,
      totalCommits: 10
    }
    
    const result = logCompareBranches(branchComparison, 'main', 'feature-branch')
    
    expect(result).toContain('identical')
    expect(result).not.toContain('ahead by')
    expect(result).not.toContain('behind by')
  })

  it('uses default formatting for unknown branch status', () => {
    const branchComparison = {
      aheadBy: 1,
      behindBy: 2,
      branchStatus: 'unknown' as any,
      save: false,
      totalCommits: 3
    }
    
    const result = logCompareBranches(branchComparison, 'main', 'feature-branch')
    
    expect(result).toContain('feature-branch has a status of [unknown]')
    expect(result).toContain('ahead by 1')
    expect(result).toContain('behind by 2')
  })
})
