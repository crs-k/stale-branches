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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.repo = exports.owner = exports.github = void 0;
exports.validateInputs = validateInputs;
const core = __importStar(require("@actions/core"));
const github_1 = require("@actions/github");
const input_compare_branches_1 = require("../enums/input-compare-branches");
const repoToken = core.getInput('repo-token');
core.setSecret(repoToken);
// Use type assertion to avoid complex inferred type issues
exports.github = (0, github_1.getOctokit)(repoToken);
_a = github_1.context.repo, exports.owner = _a.owner, exports.repo = _a.repo;
/**
 * Validates the Action's inputs and assigns them to the Inputs type
 *
 * @returns {Inputs} Valid inputs @see {@link Inputs}
 */
async function validateInputs() {
    const result = {};
    try {
        //Validate days-before-stale & days-before-delete
        const inputDaysBeforeStale = Number(core.getInput('days-before-stale'));
        const inputDaysBeforeDelete = Number(core.getInput('days-before-delete'));
        if (inputDaysBeforeStale >= inputDaysBeforeDelete) {
            throw new Error('days-before-stale cannot be greater than or equal to days-before-delete');
        }
        if (inputDaysBeforeStale.toString() === 'NaN') {
            throw new Error('days-before-stale must be a number');
        }
        if (inputDaysBeforeDelete.toString() === 'NaN') {
            throw new Error('days-before-delete must be a number');
        }
        if (inputDaysBeforeStale < 0) {
            throw new Error('days-before-stale must be greater than zero');
        }
        //Validate comment-updates
        const inputCommentUpdates = core.getBooleanInput('comment-updates');
        //Validate max-issues
        const inputMaxIssues = Number(core.getInput('max-issues'));
        if (inputMaxIssues.toString() === 'NaN') {
            throw new Error('max-issues must be a number');
        }
        if (inputMaxIssues < 0) {
            throw new Error('max-issues must be greater than zero');
        }
        //Validate tag-committer
        const inputTagLastCommitter = core.getBooleanInput('tag-committer');
        //Validate stale-branch-label
        const inputStaleBranchLabel = String(core.getInput('stale-branch-label'));
        if (inputStaleBranchLabel.length > 50) {
            throw new Error('stale-branch-label must be 50 characters or less');
        }
        //Validate compare-branches
        const inputCompareBranches = core.getInput('compare-branches');
        if (!(inputCompareBranches in input_compare_branches_1.CompareBranchesEnum)) {
            throw new Error(`compare-branches input of '${inputCompareBranches}' is not valid.`);
        }
        //Validate branches-filter-regex
        const branchesFilterRegex = String(core.getInput('branches-filter-regex'));
        if (branchesFilterRegex.length > 50) {
            throw new Error('branches-filter-regex must be 50 characters or less');
        }
        const inputRateLimit = core.getBooleanInput('rate-limit');
        const inputPrCheck = core.getBooleanInput('pr-check');
        const dryRun = core.getBooleanInput('dry-run');
        const ignoreIssueInteraction = core.getBooleanInput('ignore-issue-interaction');
        const includeProtectedBranches = core.getBooleanInput('include-protected-branches');
        const ignoreCommitMessages = core.getInput('ignore-commit-messages');
        //Assign inputs
        result.daysBeforeStale = inputDaysBeforeStale;
        result.daysBeforeDelete = inputDaysBeforeDelete;
        result.commentUpdates = inputCommentUpdates;
        result.maxIssues = inputMaxIssues;
        result.tagLastCommitter = inputTagLastCommitter;
        result.staleBranchLabel = inputStaleBranchLabel;
        result.compareBranches = inputCompareBranches;
        result.branchesFilterRegex = branchesFilterRegex;
        result.rateLimit = inputRateLimit;
        result.prCheck = inputPrCheck;
        result.dryRun = dryRun;
        result.ignoreIssueInteraction = ignoreIssueInteraction;
        result.includeProtectedBranches = includeProtectedBranches;
        if (ignoreCommitMessages) {
            result.ignoreCommitMessages = ignoreCommitMessages;
        }
    }
    catch (err) {
        if (err instanceof Error) {
            core.setFailed(`Failed to validate inputs. Error: ${err.message}`);
        }
        else {
            core.setFailed(`Failed to validate inputs.`);
        }
    }
    return result;
}
//# sourceMappingURL=get-context.js.map