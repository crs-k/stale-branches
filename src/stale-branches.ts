import * as core from '@actions/core'
import {closeIssue} from './functions/close-issue'
import {compareBranches} from './functions/compare-branches'
import {createIssue} from './functions/create-issue'
import {createIssueComment} from './functions/create-issue-comment'
import {createIssueTitleString} from './functions/utils/create-issues-title-string'
import {deleteBranch} from './functions/delete-branch'
import {getBranches} from './functions/get-branches'
import {getIssueBudget} from './functions/get-stale-issue-budget'
import {getIssues} from './functions/get-issues'
import {getRateLimit} from './functions/get-rate-limit'
import {getRecentCommitAge} from './functions/get-commit-age'
import {getRecentCommitInfo} from './functions/get-commit-info'
import {logActiveBranch} from './functions/logging/log-active-branch'
import {logBranchGroupColor} from './functions/logging/log-branch-group-color'
import {logLastCommitColor} from './functions/logging/log-last-commit-color'
import {logMaxIssues} from './functions/logging/log-max-issues'
import {logOrphanedIssues} from './functions/logging/log-orphaned-issues'
import {logRateLimitBreak} from './functions/logging/log-rate-limit-break'
import {logTotalAssessed} from './functions/logging/log-total-assessed'
import {logTotalDeleted} from './functions/logging/log-total-deleted'
import {validateInputs} from './functions/get-context'
import {filterBranches} from './functions/utils/filter-branches'
import {getPr} from './functions/get-pr'
import {logSkippedBranch} from './functions/logging/log-skipped-branch'
import {Inputs} from './types/inputs'
import {getBranchProtectionStatus} from './functions/get-branch-protection'
import {logBranchProtection} from './functions/logging/log-branch-protection'
import {github, owner, repo} from './functions/get-context'

async function closeIssueWrappedLogs(issueNumber: number, validInputs: Inputs, branchName: string): Promise<string> {
  if (!validInputs.ignoreIssueInteraction && !validInputs.dryRun) {
    return await closeIssue(issueNumber)
  } else if (validInputs.dryRun) {
    core.info(`Dry Run: Issue would be closed for branch: ${branchName}`)
  } else if (validInputs.ignoreIssueInteraction) {
    core.info(`Ignoring issue interaction: Issue would be closed for branch: ${branchName}`)
  }
  return ''
}
export async function run(): Promise<void> {
  //Declare output arrays
  const outputDeletes: string[] = []
  const outputStales: string[] = []

  try {
    //Validate & Return input values
    const validInputs = await validateInputs()
    if (validInputs.daysBeforeStale == null) {
      throw new Error('Invalid inputs')
    }
    //Collect Branches, Issue Budget, Existing Issues, & initialize lastCommitLogin
    const unfilteredBranches = await getBranches(validInputs.includeProtectedBranches)
    const branches = await filterBranches(unfilteredBranches, validInputs.branchesFilterRegex)
    const outputTotal = branches.length
    let existingIssue = await getIssues(validInputs.staleBranchLabel)
    let issueBudgetRemaining = await getIssueBudget(validInputs.maxIssues, validInputs.staleBranchLabel)
    let lastCommitLogin = 'Unknown'

    // Get default branch name and SHAs if needed
    let defaultBranch = ''
    let defaultBranchShas: Set<string> | undefined = undefined
    if (validInputs.ignoreDefaultBranchCommits) {
      // Use the repo API to get the default branch name
      const repoMeta = await github.rest.repos.get({owner, repo})
      defaultBranch = repoMeta.data.default_branch
      // Fetch SHAs from the default branch (up to maxAgeDays)
      let page = 1
      let shas: string[] = []
      let done = false
      const maxAgeDays = validInputs.daysBeforeDelete
      const now = Date.now()
      while (!done) {
        const resp = await github.rest.repos.listCommits({owner, repo, sha: defaultBranch, per_page: 100, page})
        if (resp.data.length === 0) break
        for (const commit of resp.data) {
          const commitDateStr = commit.commit?.committer?.date
          if (commitDateStr) {
            const commitDateTime = new Date(commitDateStr).getTime()
            const commitAge = Math.floor((now - commitDateTime) / (1000 * 60 * 60 * 24))
            if (commitAge > maxAgeDays) {
              done = true
              break
            }
          }
          shas.push(commit.sha)
        }
        if (resp.data.length < 100) done = true
        page++
      }
      defaultBranchShas = new Set(shas)
    }

    // Assess Branches
    for (const branchToCheck of branches) {
      // Check branch protection for this branch only if we need to know the protection status
      let protection = {isProtected: false, protectionType: '', canDelete: true}
      if (validInputs.includeProtectedBranches || validInputs.includeRulesetBranches) {
        protection = await getBranchProtectionStatus(branchToCheck.branchName, validInputs.includeProtectedBranches, validInputs.includeRulesetBranches)
      }
      //Get age of last commit, generate issue title, and filter existing issues to current branch
      let commitAge: number
      let ignoredCommitInfo: {ignoredCount: number; usedFallback: boolean} | undefined = undefined
      let committer: string | undefined = undefined
      let lastMeaningfulSha: string | undefined = undefined
      if (validInputs.ignoreCommitMessages && validInputs.ignoreCommitMessages.trim() !== '') {
        const ignoredMessages = validInputs.ignoreCommitMessages
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
        const commitInfo = await getRecentCommitInfo(
          branchToCheck.commmitSha,
          ignoredMessages,
          validInputs.daysBeforeDelete,
          validInputs.ignoreCommitters,
          defaultBranchShas,
          validInputs.ignoreDefaultBranchCommits
        )
        commitAge = commitInfo.age
        committer = commitInfo.committer
        lastMeaningfulSha = commitInfo.sha
        ignoredCommitInfo = {ignoredCount: commitInfo.ignoredCount, usedFallback: commitInfo.usedFallback}
        if (validInputs.tagLastCommitter === true) {
          lastCommitLogin = commitInfo.committer
        }
      } else {
        // No ignored messages, but still use getRecentCommitInfo for consistency
        const commitInfo = await getRecentCommitInfo(branchToCheck.commmitSha, [], undefined, validInputs.ignoreCommitters, defaultBranchShas, validInputs.ignoreDefaultBranchCommits)
        commitAge = commitInfo.age
        committer = commitInfo.committer
        lastMeaningfulSha = commitInfo.sha
        if (validInputs.tagLastCommitter === true) {
          lastCommitLogin = commitInfo.committer
        }
      }
      const issueTitleString = createIssueTitleString(branchToCheck.branchName)
      const filteredIssue = existingIssue.filter(branchIssue => branchIssue.issueTitle === issueTitleString)

      // Check if we should skip this branch due to PRs before starting the output group
      let skipDueToActivePR = false
      let activePrCount = 0
      if (validInputs.prCheck) {
        activePrCount = await getPr(branchToCheck.branchName)
        skipDueToActivePR = activePrCount > 0
      }

      // Start output group for current branch assessment (after commitAge is known)
      core.startGroup(logBranchGroupColor(branchToCheck.branchName, commitAge, validInputs.daysBeforeStale, validInputs.daysBeforeDelete))

      // Log branch protection status only if we checked it
      if (validInputs.includeProtectedBranches || validInputs.includeRulesetBranches) {
        const protectionMsg = logBranchProtection(protection.isProtected, protection.canDelete, protection.protectionType, branchToCheck.branchName)
        core.info(protectionMsg)
      }
      
      // Skip protected branches if not including them
      if (protection.isProtected && !protection.canDelete) {
        core.endGroup()
        continue
      }

      // Log last commit age
      core.info(logLastCommitColor(commitAge, validInputs.daysBeforeStale, validInputs.daysBeforeDelete, ignoredCommitInfo, committer, lastMeaningfulSha))

      // Break if Rate Limit usage exceeds 95%
      if (validInputs.rateLimit) {
        const rateLimit = await getRateLimit()
        if (rateLimit.used > 95) {
          core.info(logRateLimitBreak(rateLimit))
          core.setFailed('Exiting to avoid rate limit violation.')
          break
        }
      }

      // Check for active pull requests if already determined there are PRs
      if (skipDueToActivePR) {
        core.info(logSkippedBranch(branchToCheck.branchName, activePrCount))
        core.endGroup()
        continue
      }

      // Create new issue if branch is stale & existing issue is not found & issue budget is >0
      if (commitAge > validInputs.daysBeforeStale) {
        if (!filteredIssue.find(findIssue => findIssue.issueTitle === issueTitleString) && issueBudgetRemaining > 0) {
          if (!validInputs.dryRun && !validInputs.ignoreIssueInteraction) {
            await createIssue(branchToCheck.branchName, commitAge, lastCommitLogin, validInputs.daysBeforeDelete, validInputs.staleBranchLabel, validInputs.tagLastCommitter)
          } else if (validInputs.dryRun) {
            core.info(`Dry Run: Issue would be created for branch: ${branchToCheck.branchName}`)
          } else if (validInputs.ignoreIssueInteraction) {
            core.info(`Ignoring issue interaction: Issue would be created for branch: ${branchToCheck.branchName}`)
          }
          issueBudgetRemaining--
          core.info(logMaxIssues(issueBudgetRemaining))
          if (!outputStales.includes(branchToCheck.branchName)) {
            outputStales.push(branchToCheck.branchName)
          }
        }
      }

      // Close issues if a branch becomes active again
      if (commitAge < validInputs.daysBeforeStale) {
        for (const issueToClose of filteredIssue) {
          if (issueToClose.issueTitle === issueTitleString) {
            core.info(logActiveBranch(branchToCheck.branchName))
            await closeIssueWrappedLogs(issueToClose.issueNumber, validInputs, branchToCheck.branchName)
          }
        }
      }

      // Update existing issues
      if (commitAge > validInputs.daysBeforeStale) {
        for (const issueToUpdate of filteredIssue) {
          if (issueToUpdate.issueTitle === issueTitleString) {
            if (!validInputs.dryRun && !validInputs.ignoreIssueInteraction) {
              await createIssueComment(
                issueToUpdate.issueNumber,
                branchToCheck.branchName,
                commitAge,
                lastCommitLogin,
                validInputs.commentUpdates,
                validInputs.daysBeforeDelete,
                validInputs.staleBranchLabel,
                validInputs.tagLastCommitter,
                ignoredCommitInfo
              )
            } else if (validInputs.dryRun) {
              core.info(`Dry Run: Issue would be updated for branch: ${branchToCheck.branchName}`)
            } else if (validInputs.ignoreIssueInteraction) {
              core.info(`Ignoring issue interaction: Issue would be updated for branch: ${branchToCheck.branchName}`)
            }
            if (!outputStales.includes(branchToCheck.branchName)) {
              outputStales.push(branchToCheck.branchName)
            }
          }
        }
      }

      // Delete expired branches
      const branchComparison = await compareBranches(branchToCheck.branchName, validInputs.compareBranches)
      if (commitAge > validInputs.daysBeforeDelete && branchComparison.save === false && !skipDueToActivePR) {
        if (!validInputs.dryRun) {
          await deleteBranch(branchToCheck.branchName)
          outputDeletes.push(branchToCheck.branchName)
        } else {
          core.info(`Dry Run: Branch would be deleted: ${branchToCheck.branchName}`)
        }
        for (const issueToDelete of filteredIssue) {
          if (issueToDelete.issueTitle === issueTitleString) {
            closeIssueWrappedLogs(issueToDelete.issueNumber, validInputs, branchToCheck.branchName)
          }
        }
      }

      // Remove filteredIssue from existingIssue
      existingIssue = existingIssue.filter(branchIssue => branchIssue.issueTitle !== issueTitleString)

      // Close output group for current branch assessment
      core.endGroup()
    }
    // Close orphaned Issues
    if (existingIssue.length > 0) {
      core.startGroup(logOrphanedIssues(existingIssue.length))
      for (const issueToDelete of existingIssue) {
        // Break if Rate Limit usage exceeds 95%
        if (validInputs.rateLimit) {
          const rateLimit = await getRateLimit()
          if (rateLimit.used > 95) {
            core.info(logRateLimitBreak(rateLimit))
            core.setFailed('Exiting to avoid rate limit violation.')
            break
          }
        }
        await closeIssueWrappedLogs(issueToDelete.issueNumber, validInputs, 'Orphaned Issue')
      }
      core.endGroup()
    }

    core.setOutput('stale-branches', JSON.stringify(outputStales))
    core.setOutput('deleted-branches', JSON.stringify(outputDeletes))
    core.info(logTotalAssessed(outputStales.length, outputTotal))
    core.info(logTotalDeleted(outputDeletes.length, outputStales.length))
  } catch (error) {
    if (error instanceof Error) core.setFailed(`Action failed. Error: ${error.message}`)
  }
}
