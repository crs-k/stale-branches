import {filterBranches} from '../../src/functions/utils/filter-branches'

describe('Filter Branches Function', () => {
    test('branchesFilterRegex is empty', async () => {
        const branches = [{branchName: 'dependabot/npm_and_yarn/test/ms'}, {branchName: 'JIRA-123'}, {branchName: 'dependabot/npm_and_yarn/123'}, {branchName: 'David'}]
        const branchesFilterRegex = ''

        const filteredBranches = await filterBranches(branches, branchesFilterRegex)
        expect(filteredBranches).toEqual(branches)
    })

    test('branchesFilterRegex is null', async () => {
        const branches = [{branchName: 'dependabot/npm_and_yarn/test/ms'}, {branchName: 'JIRA-123'}, {branchName: 'dependabot/npm_and_yarn/123'}, {branchName: 'David'}]
        const branchesFilterRegex = null

        const filteredBranches = await filterBranches(branches, branchesFilterRegex)
        expect(filteredBranches).toEqual(branches)
    })

    test('branchesFilterRegex to ignore dependabot', async () => {
        const branches = [{branchName: 'dependabot/npm_and_yarn/test/ms'}, {branchName: 'JIRA-123'}, {branchName: 'mybranch/dependabot/123'}, {branchName: 'David'}]
        const branchesFilterRegex = `^((?!dependabot))`

        const expectedBranches = [{branchName: 'JIRA-123'}, {branchName: 'mybranch/dependabot/123'}, {branchName: 'David'}] 

        const filteredBranches = await filterBranches(branches, branchesFilterRegex)
        expect(filteredBranches).toEqual(expectedBranches)
    })
})
