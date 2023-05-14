jest.mock('@actions/core')
jest.mock('@actions/github')

const core = require('@actions/core')
import {filterBranches} from '../../src/functions/filter-branches'
import styles from 'ansi-styles'

describe('Filter Branches Function', () => {
    test('ignoreBranchesRegex is empty', async () => {
        const branches = [{branchName: 'dependabot/npm_and_yarn/test/ms'}, {branchName: 'JIRA-123'}, {branchName: 'dependabot/npm_and_yarn/123'}, {branchName: 'David'}]
        const ignoreBranchesRegex = ''

        const filteredBranches = await filterBranches(branches, ignoreBranchesRegex)
        expect(filteredBranches).toEqual(branches)
    })

    test('ignoreBranchesRegex is null', async () => {
        const branches = [{branchName: 'dependabot/npm_and_yarn/test/ms'}, {branchName: 'JIRA-123'}, {branchName: 'dependabot/npm_and_yarn/123'}, {branchName: 'David'}]
        const ignoreBranchesRegex = null

        const filteredBranches = await filterBranches(branches, ignoreBranchesRegex)
        expect(filteredBranches).toEqual(branches)
    })

    test('ignoreBranchesRegex is wants to ignore dependabot', async () => {
        const branches = [{branchName: 'dependabot/npm_and_yarn/test/ms'}, {branchName: 'JIRA-123'}, {branchName: 'dependabot/npm_and_yarn/123'}, {branchName: 'David'}]
        const ignoreBranchesRegex = `^((?!dependabot/).)*$`

        const expectedBranches = [{branchName: 'JIRA-123'}, {branchName: 'David'}] 

        const filteredBranches = await filterBranches(branches, ignoreBranchesRegex)
        expect(filteredBranches).toEqual(expectedBranches)
    })
})
