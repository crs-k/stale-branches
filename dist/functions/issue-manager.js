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
exports.closeIssueWithLogging = closeIssueWithLogging;
exports.createStaleIssue = createStaleIssue;
exports.updateStaleIssue = updateStaleIssue;
exports.processActiveBranchIssues = processActiveBranchIssues;
exports.processStaleBranchIssues = processStaleBranchIssues;
const core = __importStar(require("@actions/core"));
const create_issue_1 = require("./create-issue");
const create_issue_comment_1 = require("./create-issue-comment");
const close_issue_1 = require("./close-issue");
const log_active_branch_1 = require("./logging/log-active-branch");
const log_max_issues_1 = require("./logging/log-max-issues");
/**
 * Handles closing an issue with proper logging and dry-run support
 */
async function closeIssueWithLogging(issueNumber, validInputs, branchName) {
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
/**
 * Creates a new issue for a stale branch
 */
async function createStaleIssue(branchName, commitAge, lastCommitLogin, validInputs, issueBudgetRemaining) {
    if (issueBudgetRemaining <= 0) {
        return { issueBudgetRemaining, staleAdded: false };
    }
    if (!validInputs.dryRun && !validInputs.ignoreIssueInteraction) {
        await (0, create_issue_1.createIssue)(branchName, commitAge, lastCommitLogin, validInputs.daysBeforeDelete, validInputs.staleBranchLabel, validInputs.tagLastCommitter);
    }
    else if (validInputs.dryRun) {
        core.info(`Dry Run: Issue would be created for branch: ${branchName}`);
    }
    else if (validInputs.ignoreIssueInteraction) {
        core.info(`Ignoring issue interaction: Issue would be created for branch: ${branchName}`);
    }
    const newBudget = issueBudgetRemaining - 1;
    core.info((0, log_max_issues_1.logMaxIssues)(newBudget));
    return { issueBudgetRemaining: newBudget, staleAdded: true };
}
/**
 * Updates an existing issue for a stale branch
 */
async function updateStaleIssue(issueNumber, branchName, commitAge, lastCommitLogin, validInputs) {
    if (!validInputs.dryRun && !validInputs.ignoreIssueInteraction) {
        await (0, create_issue_comment_1.createIssueComment)(issueNumber, branchName, commitAge, lastCommitLogin, validInputs.commentUpdates, validInputs.daysBeforeDelete, validInputs.staleBranchLabel, validInputs.tagLastCommitter);
    }
    else if (validInputs.dryRun) {
        core.info(`Dry Run: Issue would be updated for branch: ${branchName}`);
    }
    else if (validInputs.ignoreIssueInteraction) {
        core.info(`Ignoring issue interaction: Issue would be updated for branch: ${branchName}`);
    }
}
/**
 * Processes issues for branches that have become active again
 */
async function processActiveBranchIssues(branchName, issueTitleString, filteredIssues, validInputs) {
    for (const issueToClose of filteredIssues) {
        if (issueToClose.issueTitle === issueTitleString) {
            core.info((0, log_active_branch_1.logActiveBranch)(branchName));
            await closeIssueWithLogging(issueToClose.issueNumber, validInputs, branchName);
        }
    }
}
/**
 * Processes issues for stale branches (create new or update existing)
 */
async function processStaleBranchIssues(branchName, issueTitleString, commitAge, lastCommitLogin, filteredIssues, validInputs, issueBudgetRemaining) {
    // Check if issue already exists
    const existingIssue = filteredIssues.find(issue => issue.issueTitle === issueTitleString);
    if (!existingIssue) {
        // Create new issue
        return await createStaleIssue(branchName, commitAge, lastCommitLogin, validInputs, issueBudgetRemaining);
    }
    else {
        // Update existing issue
        await updateStaleIssue(existingIssue.issueNumber, branchName, commitAge, lastCommitLogin, validInputs);
        return { issueBudgetRemaining, staleAdded: true };
    }
}
//# sourceMappingURL=issue-manager.js.map