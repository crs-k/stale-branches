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
exports.createIssue = createIssue;
const assert = __importStar(require("assert"));
const core = __importStar(require("@actions/core"));
const get_context_1 = require("./get-context");
const create_issues_title_string_1 = require("./utils/create-issues-title-string");
const log_new_issue_1 = require("./logging/log-new-issue");
/**
 * Creates a GitHub issue
 *
 * @param {string} branch The branch currently being worked on
 *
 * @param {number} commitAge The age (in days) of the last commit to a branch
 *
 * @param {string} lastCommitter The username that last committed to the branch
 *
 * @param {number} daysBeforeDelete The amount of days before a branch is to be deleted
 *
 * @param {string} staleBranchLabel The label to be used to identify issues related to this Action
 *
 * @param {boolean} tagLastCommitter If true, the user that last committed to this branch will be tagged
 *
 * @returns {number} The ID of the issue created
 */
async function createIssue(branch, commitAge, lastCommitter, daysBeforeDelete, staleBranchLabel, tagLastCommitter) {
    let issueId;
    let bodyString;
    const daysUntilDelete = Math.max(0, daysBeforeDelete - commitAge);
    const issueTitleString = (0, create_issues_title_string_1.createIssueTitleString)(branch);
    switch (tagLastCommitter) {
        case true:
            bodyString = `@${lastCommitter}, \r \r ${branch} has had no activity for ${commitAge.toString()} days. \r \r This branch will be automatically deleted in ${daysUntilDelete.toString()} days.`;
            break;
        case false:
            bodyString = `${branch} has had no activity for ${commitAge.toString()} days. \r \r This branch will be automatically deleted in ${daysUntilDelete.toString()} days.`;
            break;
    }
    try {
        const issueResponse = await get_context_1.github.rest.issues.create({
            owner: get_context_1.owner,
            repo: get_context_1.repo,
            title: issueTitleString,
            body: bodyString,
            labels: [
                {
                    name: staleBranchLabel,
                    color: 'B60205',
                    description: 'Used by Stale Branches Action to label issues'
                }
            ]
        });
        issueId = issueResponse.data.id;
        assert.ok(issueId, 'Issue ID cannot be empty');
        core.info((0, log_new_issue_1.logNewIssue)(branch));
    }
    catch (err) {
        if (err instanceof Error) {
            core.setFailed(`Failed to create issue for ${branch}. Error: ${err.message}`);
        }
        else {
            core.setFailed(`Failed to create issue for ${branch}.`);
        }
        issueId = 0;
    }
    return issueId;
}
//# sourceMappingURL=create-issue.js.map