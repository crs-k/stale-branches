import {github, owner, repo} from './get-context'
import {getDays} from './utils/get-time'

const PER_PAGE = 100

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function committerOf(commit: any): string {
  return commit.committer?.login || commit.author?.login || commit.commit?.committer?.name || commit.commit?.author?.name || 'Unknown'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ageOf(commit: any, now: number): number {
  return getDays(now, new Date(commit.commit.committer.date).getTime())
}

/**
 * Retrieves the age and committer of the most recent meaningful commit made on a branch itself.
 *
 * Only commits reachable from the branch but not from the default branch are considered, so a
 * branch's age can never be taken from the default branch's own history. If every such commit
 * matches the ignore filters, the oldest one stands in for the branch's age; if the branch has no
 * commits of its own, its tip commit does.
 *
 * @param {string} sha The SHA of the branch head
 * @param {string} defaultBranch The default branch to compare against
 * @param {string[]} ignoredMessages Commit messages or substrings to ignore
 * @param {string[]} [ignoredCommitters] Committer usernames/names to ignore
 *
 * @returns {{ committer: string, age: number, ignoredCount: number, usedFallback: boolean, allBranchCommitsIgnored?: boolean, sha?: string }}
 */
export async function getBranchCommitInfo(
  sha: string,
  defaultBranch: string,
  ignoredMessages: string[],
  ignoredCommitters: string[] = []
): Promise<{committer: string; age: number; ignoredCount: number; usedFallback: boolean; allBranchCommitsIgnored?: boolean; sha?: string}> {
  const now = Date.now()
  const basehead = `${defaultBranch}...${sha}`
  type Comparison = Awaited<ReturnType<typeof github.rest.repos.compareCommitsWithBasehead>>['data']
  const compare = async (page: number): Promise<Comparison> => (await github.rest.repos.compareCommitsWithBasehead({owner, repo, basehead, per_page: PER_PAGE, page})).data
  const ignoredCommitterNames = ignoredCommitters.map(name => name.toLowerCase())

  const firstPage = await compare(1)
  if (firstPage.total_commits === 0) {
    const tip = (await github.rest.repos.getCommit({owner, repo, ref: sha})).data
    return {committer: committerOf(tip), age: ageOf(tip, now), ignoredCount: 0, usedFallback: false, sha: tip.sha}
  }

  // Commits come oldest first, so walk from the last page back to find the newest meaningful one
  let ignoredCount = 0
  for (let page = Math.ceil(firstPage.total_commits / PER_PAGE); page >= 1; page--) {
    const commits = page === 1 ? firstPage.commits : (await compare(page)).commits
    for (const commit of [...commits].reverse()) {
      if (!commit.commit?.committer?.date) continue
      const committer = committerOf(commit)
      const message = commit.commit?.message || ''
      if (ignoredMessages.some(msg => message.includes(msg)) || ignoredCommitterNames.includes(committer.toLowerCase())) {
        ignoredCount++
        continue
      }
      return {committer, age: ageOf(commit, now), ignoredCount, usedFallback: false, sha: commit.sha}
    }
  }

  const oldest = firstPage.commits[0]
  return {committer: committerOf(oldest), age: ageOf(oldest, now), ignoredCount, usedFallback: false, allBranchCommitsIgnored: true, sha: oldest.sha}
}
