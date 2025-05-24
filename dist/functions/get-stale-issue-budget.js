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
exports.getIssueBudget = getIssueBudget;
const assert = __importStar(require("assert"));
const core = __importStar(require("@actions/core"));
const get_context_1 = require("./get-context");
const log_max_issues_1 = require("./logging/log-max-issues");
/**
 * Calculates the amount of issues that can be created during this workflow run
 *
 * @param {number} maxIssues The total number of issues that can exist for this action
 *
 * @param {string} staleBranchLabel The label to be used to identify issues related to this Action
 *
 * @returns {string} The maximum amount of issues that can be created during a workflow run
 */
async function getIssueBudget(maxIssues, staleBranchLabel) {
    let issues;
    let issueCount = 0;
    let issueBudgetRemaining;
    try {
        const issueResponse = await get_context_1.github.paginate(get_context_1.github.rest.issues.listForRepo, {
            owner: get_context_1.owner,
            repo: get_context_1.repo,
            state: 'open',
            labels: staleBranchLabel,
            per_page: 100
        }, response => response.data.map(issue => ({ issueTitle: issue.title, issueNumber: issue.number })));
        issues = issueResponse;
        issueCount = new Set(issues.map(filteredIssues => filteredIssues.issueNumber)).size;
        issueBudgetRemaining = Math.max(0, maxIssues - issueCount);
        assert.ok(issues, 'Issue ID cannot be empty');
    }
    catch (err) {
        if (err instanceof Error) {
            core.setFailed(`Failed to calculate issue budget. Error: ${err.message}`);
        }
        else {
            core.setFailed(`Failed to calculate issue budget.`);
        }
        issueBudgetRemaining = 0;
    }
    core.info((0, log_max_issues_1.logMaxIssues)(issueBudgetRemaining));
    return issueBudgetRemaining;
}
//# sourceMappingURL=get-stale-issue-budget.js.map