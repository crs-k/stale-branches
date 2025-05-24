import {filterBranches} from '../../src/functions/utils/filter-branches'

describe('Filter Branches Function', () => {
    test('branchesFilterRegex is empty', async () => {
        const branches = [
            {branchName: 'dependabot/npm_and_yarn/test/ms', commmitSha: 'abc123'}, 
            {branchName: 'JIRA-123', commmitSha: 'def456'}, 
            {branchName: 'dependabot/npm_and_yarn/123', commmitSha: 'ghi789'}, 
            {branchName: 'David', commmitSha: 'jkl012'}
        ]
        const branchesFilterRegex = ''

        const filteredBranches = await filterBranches(branches, branchesFilterRegex)
        expect(filteredBranches).toEqual(branches)
    })

    test('branchesFilterRegex is null', async () => {
        const branches = [
            {branchName: 'dependabot/npm_and_yarn/test/ms', commmitSha: 'abc123'}, 
            {branchName: 'JIRA-123', commmitSha: 'def456'}, 
            {branchName: 'dependabot/npm_and_yarn/123', commmitSha: 'ghi789'}, 
            {branchName: 'David', commmitSha: 'jkl012'}
        ]
        const branchesFilterRegex = undefined

        const filteredBranches = await filterBranches(branches, branchesFilterRegex)
        expect(filteredBranches).toEqual(branches)
    })

    test('branchesFilterRegex to ignore dependabot', async () => {
        const branches = [
            {branchName: 'dependabot/npm_and_yarn/test/ms', commmitSha: 'abc123'}, 
            {branchName: 'JIRA-123', commmitSha: 'def456'}, 
            {branchName: 'mybranch/dependabot/123', commmitSha: 'ghi789'}, 
            {branchName: 'David', commmitSha: 'jkl012'}
        ]
        const branchesFilterRegex = `^((?!dependabot))`

        const expectedBranches = [
            {branchName: 'JIRA-123', commmitSha: 'def456'}, 
            {branchName: 'mybranch/dependabot/123', commmitSha: 'ghi789'}, 
            {branchName: 'David', commmitSha: 'jkl012'}
        ] 

        const filteredBranches = await filterBranches(branches, branchesFilterRegex)
        expect(filteredBranches).toEqual(expectedBranches)
    })
})
