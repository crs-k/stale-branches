import {logCompareBranches} from '../../../src/functions/logging/log-compare-branches'
import {BranchComparison} from '../../../src/types/branch-comparison'

describe('Log Compare Branches Function', () => {
  const base = 'main'
  const head = 'feature-branch'

  test('logs diverged branch status', () => {
    const branchComparison: BranchComparison = {
      branchStatus: 'diverged',
      aheadBy: 3,
      behindBy: 2,
      totalCommits: 5,
      save: false
    }

    const result = logCompareBranches(branchComparison, base, head)

    expect(result).toContain('diverged')
    expect(result).toContain(`${head} has`)
    expect(result).toContain(`from ${base}`)
    expect(result).toContain('is ahead by')
    expect(result).toContain('and behind by')
  })

  test('logs ahead branch status', () => {
    const branchComparison: BranchComparison = {
      branchStatus: 'ahead',
      aheadBy: 5,
      behindBy: 0,
      totalCommits: 5,
      save: false
    }

    const result = logCompareBranches(branchComparison, base, head)

    expect(result).toContain('ahead')
    expect(result).toContain(`${head} is`)
    expect(result).toContain(`of ${base}`)
    expect(result).toContain('5')
  })

  test('logs behind branch status', () => {
    const branchComparison: BranchComparison = {
      branchStatus: 'behind',
      aheadBy: 0,
      behindBy: 4,
      totalCommits: 4,
      save: false
    }

    const result = logCompareBranches(branchComparison, base, head)

    expect(result).toContain('behind')
    expect(result).toContain(`${head} is`)
    expect(result).toContain(`${base} by`)
    expect(result).toContain('4')
  })

  test('logs identical branch status', () => {
    const branchComparison: BranchComparison = {
      branchStatus: 'identical',
      aheadBy: 0,
      behindBy: 0,
      totalCommits: 0,
      save: false
    }

    const result = logCompareBranches(branchComparison, base, head)

    expect(result).toContain('identical')
    expect(result).toContain(`${head} is`)
    expect(result).toContain(`to ${base}`)
  })

  test('logs unknown branch status with default message', () => {
    const branchComparison: BranchComparison = {
      branchStatus: 'unknown',
      aheadBy: 1,
      behindBy: 1,
      totalCommits: 2,
      save: false
    }

    const result = logCompareBranches(branchComparison, base, head)

    expect(result).toContain('[unknown]')
    expect(result).toContain(`${head} has a status of`)
    expect(result).toContain(`in comparison to ${base}`)
    expect(result).toContain('ahead by 1 commits')
    expect(result).toContain('behind by 1 commits')
  })
})