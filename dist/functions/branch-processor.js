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
exports.checkRateLimit = checkRateLimit;
exports.checkActivePullRequests = checkActivePullRequests;
exports.getBranchCommitAge = getBranchCommitAge;
exports.getLastCommitterLogin = getLastCommitterLogin;
exports.prepareBranchAssessment = prepareBranchAssessment;
const core = __importStar(require("@actions/core"));
const get_rate_limit_1 = require("./get-rate-limit");
const get_pr_1 = require("./get-pr");
const get_commit_age_1 = require("./get-commit-age");
const get_committer_login_1 = require("./get-committer-login");
const create_issues_title_string_1 = require("./utils/create-issues-title-string");
const compare_branches_1 = require("./compare-branches");
const log_branch_group_color_1 = require("./logging/log-branch-group-color");
const log_branch_group_color_skip_1 = require("./logging/log-branch-group-color-skip");
const log_last_commit_color_1 = require("./logging/log-last-commit-color");
const log_skipped_branch_1 = require("./logging/log-skipped-branch");
const log_rate_limit_break_1 = require("./logging/log-rate-limit-break");
/**
 * Checks if a branch should be skipped due to rate limiting
 */
async function checkRateLimit(validInputs) {
    if (!validInputs.rateLimit) {
        return false;
    }
    const rateLimit = await (0, get_rate_limit_1.getRateLimit)();
    if (rateLimit.used > 95) {
        core.info((0, log_rate_limit_break_1.logRateLimitBreak)(rateLimit));
        core.setFailed('Exiting to avoid rate limit violation.');
        return true;
    }
    return false;
}
/**
 * Checks if a branch should be skipped due to active pull requests
 */
async function checkActivePullRequests(branchName, validInputs) {
    if (!validInputs.prCheck) {
        return { shouldSkip: false };
    }
    const activePrs = await (0, get_pr_1.getPr)(branchName);
    if (activePrs > 0) {
        core.startGroup((0, log_branch_group_color_skip_1.logBranchGroupColorSkip)(branchName));
        core.info((0, log_skipped_branch_1.logSkippedBranch)(branchName, activePrs));
        core.endGroup();
        return {
            shouldSkip: true,
            reason: 'Active pull requests',
            activePrs
        };
    }
    return { shouldSkip: false };
}
/**
 * Gets the commit age for a branch, handling ignored commit messages
 */
async function getBranchCommitAge(commitSha, validInputs) {
    if (validInputs.ignoreCommitMessages && validInputs.ignoreCommitMessages.trim() !== '') {
        const ignoredMessages = validInputs.ignoreCommitMessages
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
        return await (0, get_commit_age_1.getRecentCommitAgeByNonIgnoredMessage)(commitSha, ignoredMessages, validInputs.daysBeforeDelete);
    }
    return await (0, get_commit_age_1.getRecentCommitAge)(commitSha);
}
/**
 * Gets the last committer login if tagging is enabled
 */
async function getLastCommitterLogin(commitSha, validInputs) {
    if (!validInputs.tagLastCommitter) {
        return 'Unknown';
    }
    return await (0, get_committer_login_1.getRecentCommitLogin)(commitSha);
}
/**
 * Processes branch metadata and prepares for branch assessment
 */
async function prepareBranchAssessment(branch, validInputs) {
    // Get commit age
    const commitAge = await getBranchCommitAge(branch.commmitSha, validInputs);
    // Generate issue title
    const issueTitleString = (0, create_issues_title_string_1.createIssueTitleString)(branch.branchName);
    // Get last committer
    const lastCommitLogin = await getLastCommitterLogin(branch.commmitSha, validInputs);
    // Compare branches
    const branchComparison = await (0, compare_branches_1.compareBranches)(branch.branchName, validInputs.compareBranches);
    // Start output group and log commit age
    core.startGroup((0, log_branch_group_color_1.logBranchGroupColor)(branch.branchName, commitAge, validInputs.daysBeforeStale, validInputs.daysBeforeDelete));
    core.info((0, log_last_commit_color_1.logLastCommitColor)(commitAge, validInputs.daysBeforeStale, validInputs.daysBeforeDelete));
    return {
        commitAge,
        issueTitleString,
        lastCommitLogin,
        branchComparison
    };
}
//# sourceMappingURL=branch-processor.js.map