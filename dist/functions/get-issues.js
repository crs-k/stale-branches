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
exports.getIssues = getIssues;
const assert = __importStar(require("assert"));
const core = __importStar(require("@actions/core"));
const get_context_1 = require("./get-context");
/**
 * Retrieves GitHub issues with the `staleBranchLabel` label attached
 *
 * @param {string} staleBranchLabel The label to be used to identify issues related to this Action
 *
 * @returns {IssueResponse} A subset of the issue data @see {@link IssueResponse}
 */
async function getIssues(staleBranchLabel) {
    let issues;
    try {
        const issueResponse = await get_context_1.github.paginate(get_context_1.github.rest.issues.listForRepo, {
            owner: get_context_1.owner,
            repo: get_context_1.repo,
            state: 'open',
            labels: staleBranchLabel,
            per_page: 100
        }, response => response.data.map(issue => ({ issueTitle: issue.title, issueNumber: issue.number })));
        issues = issueResponse;
        assert.ok(issues, 'Issue ID cannot be empty');
    }
    catch (err) {
        if (err instanceof Error) {
            core.setFailed(`Failed to locate issues. Error: ${err.message}`);
        }
        else {
            core.setFailed(`Failed to locate issues.`);
        }
        issues = [{ issueTitle: '', issueNumber: -1 }];
    }
    return issues;
}
//# sourceMappingURL=get-issues.js.map