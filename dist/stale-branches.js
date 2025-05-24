"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const core = __importStar(require("@actions/core"));
const close_issue_1 = require("./functions/close-issue");
const compare_branches_1 = require("./functions/compare-branches");
const create_issue_1 = require("./functions/create-issue");
const create_issue_comment_1 = require("./functions/create-issue-comment");
const create_issues_title_string_1 = require("./functions/utils/create-issues-title-string");
const delete_branch_1 = require("./functions/delete-branch");
const get_branches_1 = require("./functions/get-branches");
const get_stale_issue_budget_1 = require("./functions/get-stale-issue-budget");
const get_issues_1 = require("./functions/get-issues");
const get_rate_limit_1 = require("./functions/get-rate-limit");
const get_commit_age_1 = require("./functions/get-commit-age");
const get_committer_login_1 = require("./functions/get-committer-login");
const log_active_branch_1 = require("./functions/logging/log-active-branch");
const log_branch_group_color_1 = require("./functions/logging/log-branch-group-color");
const log_last_commit_color_1 = require("./functions/logging/log-last-commit-color");
const log_max_issues_1 = require("./functions/logging/log-max-issues");
const log_orphaned_issues_1 = require("./functions/logging/log-orphaned-issues");
const log_rate_limit_break_1 = require("./functions/logging/log-rate-limit-break");
const log_total_assessed_1 = require("./functions/logging/log-total-assessed");
const log_total_deleted_1 = require("./functions/logging/log-total-deleted");
const get_context_1 = require("./functions/get-context");
const filter_branches_1 = require("./functions/utils/filter-branches");
const get_pr_1 = require("./functions/get-pr");
const log_skipped_branch_1 = require("./functions/logging/log-skipped-branch");
const log_branch_group_color_skip_1 = require("./functions/logging/log-branch-group-color-skip");
async function closeIssueWrappedLogs(issueNumber, validInputs, branchName) {
    if (!validInputs.ignoreIssueInteraction && !validInputs.dryRun) {
        return await (0, close_issue_1.closeIssue)(issueNumber);
    }
    else if (validInputs.dryRun) {
        core.info(`Dry Run: Issue would be closed for branch: ${branchName}`);
    }
    else if (validInputs.ignoreIssueInteraction) {
        core.info(`Ignoring issue interaction: Issue would be closed for branch: ${branchName}`);
    }
    return '';
}
async function run() {
    //Declare output arrays
    const outputDeletes = [];
    const outputStales = [];
    try {
        //Validate & Return input values
        const validInputs = await (0, get_context_1.validateInputs)();
        if (validInputs.daysBeforeStale == null) {
            throw new Error('Invalid inputs');
        }
        //Collect Branches, Issue Budget, Existing Issues, & initialize lastCommitLogin
        const unfilteredBranches = await (0, get_branches_1.getBranches)(validInputs.includeProtectedBranches);
        const branches = await (0, filter_branches_1.filterBranches)(unfilteredBranches, validInputs.branchesFilterRegex || '');
        const outputTotal = branches.length;
        let existingIssue = await (0, get_issues_1.getIssues)(validInputs.staleBranchLabel);
        let issueBudgetRemaining = await (0, get_stale_issue_budget_1.getIssueBudget)(validInputs.maxIssues, validInputs.staleBranchLabel);
        let lastCommitLogin = 'Unknown';
        // Assess Branches
        for (const branchToCheck of branches) {
            // Break if Rate Limit usage exceeds 95%
            if (validInputs.rateLimit) {
                const rateLimit = await (0, get_rate_limit_1.getRateLimit)();
                if (rateLimit.used > 95) {
                    core.info((0, log_rate_limit_break_1.logRateLimitBreak)(rateLimit));
                    core.setFailed('Exiting to avoid rate limit violation.');
                    break;
                }
            }
            // Check for active pull requests if prCheck is true
            if (validInputs.prCheck) {
                const activePrs = await (0, get_pr_1.getPr)(branchToCheck.branchName);
                if (activePrs > 0) {
                    core.startGroup((0, log_branch_group_color_skip_1.logBranchGroupColorSkip)(branchToCheck.branchName));
                    core.info((0, log_skipped_branch_1.logSkippedBranch)(branchToCheck.branchName, activePrs));
                    core.endGroup();
                    continue;
                }
            }
            //Get age of last commit, generate issue title, and filter existing issues to current branch
            let commitAge;
            if (validInputs.ignoreCommitMessages && validInputs.ignoreCommitMessages.trim() !== '') {
                const ignoredMessages = validInputs.ignoreCommitMessages
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean);
                commitAge = await (0, get_commit_age_1.getRecentCommitAgeByNonIgnoredMessage)(branchToCheck.commmitSha, ignoredMessages, validInputs.daysBeforeDelete);
            }
            else {
                commitAge = await (0, get_commit_age_1.getRecentCommitAge)(branchToCheck.commmitSha);
            }
            const issueTitleString = (0, create_issues_title_string_1.createIssueTitleString)(branchToCheck.branchName);
            const filteredIssue = existingIssue.filter(branchIssue => branchIssue.issueTitle === issueTitleString);
            // Skip looking for last commit's login if input is set to false
            if (validInputs.tagLastCommitter === true) {
                lastCommitLogin = await (0, get_committer_login_1.getRecentCommitLogin)(branchToCheck.commmitSha);
            }
            // Start output group for current branch assessment
            core.startGroup((0, log_branch_group_color_1.logBranchGroupColor)(branchToCheck.branchName, commitAge, validInputs.daysBeforeStale, validInputs.daysBeforeDelete));
            //Compare current branch to default branch
            const branchComparison = await (0, compare_branches_1.compareBranches)(branchToCheck.branchName, validInputs.compareBranches);
            //Log last commit age
            core.info((0, log_last_commit_color_1.logLastCommitColor)(commitAge, validInputs.daysBeforeStale, validInputs.daysBeforeDelete));
            //Create new issue if branch is stale & existing issue is not found & issue budget is >0
            if (commitAge > validInputs.daysBeforeStale) {
                if (!filteredIssue.find(findIssue => findIssue.issueTitle === issueTitleString) && issueBudgetRemaining > 0) {
                    if (!validInputs.dryRun && !validInputs.ignoreIssueInteraction) {
                        await (0, create_issue_1.createIssue)(branchToCheck.branchName, commitAge, lastCommitLogin, validInputs.daysBeforeDelete, validInputs.staleBranchLabel, validInputs.tagLastCommitter);
                    }
                    else if (validInputs.dryRun) {
                        core.info(`Dry Run: Issue would be created for branch: ${branchToCheck.branchName}`);
                    }
                    else if (validInputs.ignoreIssueInteraction) {
                        core.info(`Ignoring issue interaction: Issue would be created for branch: ${branchToCheck.branchName}`);
                    }
                    issueBudgetRemaining--;
                    core.info((0, log_max_issues_1.logMaxIssues)(issueBudgetRemaining));
                    if (!outputStales.includes(branchToCheck.branchName)) {
                        outputStales.push(branchToCheck.branchName);
                    }
                }
            }
            //Close issues if a branch becomes active again
            if (commitAge < validInputs.daysBeforeStale) {
                for (const issueToClose of filteredIssue) {
                    if (issueToClose.issueTitle === issueTitleString) {
                        core.info((0, log_active_branch_1.logActiveBranch)(branchToCheck.branchName));
                        await closeIssueWrappedLogs(issueToClose.issueNumber, validInputs, branchToCheck.branchName);
                    }
                }
            }
            //Update existing issues
            if (commitAge > validInputs.daysBeforeStale) {
                for (const issueToUpdate of filteredIssue) {
                    if (issueToUpdate.issueTitle === issueTitleString) {
                        if (!validInputs.dryRun && !validInputs.ignoreIssueInteraction) {
                            await (0, create_issue_comment_1.createIssueComment)(issueToUpdate.issueNumber, branchToCheck.branchName, commitAge, lastCommitLogin, validInputs.commentUpdates, validInputs.daysBeforeDelete, validInputs.staleBranchLabel, validInputs.tagLastCommitter);
                        }
                        else if (validInputs.dryRun) {
                            core.info(`Dry Run: Issue would be updated for branch: ${branchToCheck.branchName}`);
                        }
                        else if (validInputs.ignoreIssueInteraction) {
                            core.info(`Ignoring issue interaction: Issue would be updated for branch: ${branchToCheck.branchName}`);
                        }
                        if (!outputStales.includes(branchToCheck.branchName)) {
                            outputStales.push(branchToCheck.branchName);
                        }
                    }
                }
            }
            //Delete expired branches
            if (commitAge > validInputs.daysBeforeDelete && branchComparison.save === false) {
                if (!validInputs.dryRun) {
                    await (0, delete_branch_1.deleteBranch)(branchToCheck.branchName);
                    outputDeletes.push(branchToCheck.branchName);
                }
                else {
                    core.info(`Dry Run: Branch would be deleted: ${branchToCheck.branchName}`);
                }
                for (const issueToDelete of filteredIssue) {
                    if (issueToDelete.issueTitle === issueTitleString) {
                        closeIssueWrappedLogs(issueToDelete.issueNumber, validInputs, branchToCheck.branchName);
                    }
                }
            }
            // Remove filteredIssue from existingIssue
            existingIssue = existingIssue.filter(branchIssue => branchIssue.issueTitle !== issueTitleString);
            // Close output group for current branch assessment
            core.endGroup();
        }
        // Close orphaned Issues
        if (existingIssue.length > 0) {
            core.startGroup((0, log_orphaned_issues_1.logOrphanedIssues)(existingIssue.length));
            for (const issueToDelete of existingIssue) {
                // Break if Rate Limit usage exceeds 95%
                if (validInputs.rateLimit) {
                    const rateLimit = await (0, get_rate_limit_1.getRateLimit)();
                    if (rateLimit.used > 95) {
                        core.info((0, log_rate_limit_break_1.logRateLimitBreak)(rateLimit));
                        core.setFailed('Exiting to avoid rate limit violation.');
                        break;
                    }
                }
                await closeIssueWrappedLogs(issueToDelete.issueNumber, validInputs, 'Orphaned Issue');
            }
            core.endGroup();
        }
        core.setOutput('stale-branches', JSON.stringify(outputStales));
        core.setOutput('deleted-branches', JSON.stringify(outputDeletes));
        core.info((0, log_total_assessed_1.logTotalAssessed)(outputStales.length, outputTotal));
        core.info((0, log_total_deleted_1.logTotalDeleted)(outputDeletes.length, outputStales.length));
    }
    catch (error) {
        if (error instanceof Error)
            core.setFailed(`Action failed. Error: ${error.message}`);
    }
}
//# sourceMappingURL=stale-branches.js.map