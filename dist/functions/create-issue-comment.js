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
exports.createIssueComment = createIssueComment;
const assert = __importStar(require("assert"));
const core = __importStar(require("@actions/core"));
const get_context_1 = require("./get-context");
const create_comment_string_1 = require("./utils/create-comment-string");
const log_update_issue_1 = require("./logging/log-update-issue");
/**
 * Creates comment on existing GitHub issue
 *
 * @param {number} issueNumber GitHub issue number
 *
 * @param {string} branch The branch currently being worked on
 *
 * @param {number} commitAge The age (in days) of the last commit to a branch
 *
 * @param {string} lastCommitter The username that last committed to the branch
 *
 * @param {boolean} commentUpdates If true, a comment will be made on the target issue
 *
 * @param {number} daysBeforeDelete The amount of days before a branch is to be deleted
 *
 * @param {string} staleBranchLabel The label to be used to identify issues related to this Action
 *
 * @param {boolean} tagLastCommitter If true, the user that last committed to this branch will be tagged
 *
 * @returns {string} The time the comment was created
 */
async function createIssueComment(issueNumber, branch, commitAge, lastCommitter, commentUpdates, daysBeforeDelete, staleBranchLabel, tagLastCommitter) {
    let createdAt = '';
    let commentUrl;
    let bodyString;
    if (commentUpdates === true) {
        bodyString = (0, create_comment_string_1.createCommentString)(branch, lastCommitter, commitAge, daysBeforeDelete, tagLastCommitter);
        try {
            const issueResponse = await get_context_1.github.rest.issues.createComment({
                owner: get_context_1.owner,
                repo: get_context_1.repo,
                issue_number: issueNumber,
                body: bodyString,
                labels: [
                    {
                        name: staleBranchLabel,
                        color: 'B60205',
                        description: 'Used by Stale Branches Action to label issues'
                    }
                ]
            });
            createdAt = issueResponse.data.created_at;
            commentUrl = issueResponse.data.html_url;
            assert.ok(createdAt, 'Created At cannot be empty');
            core.info((0, log_update_issue_1.logUpdateIssue)(issueNumber, createdAt, commentUrl));
        }
        catch (err) {
            if (err instanceof Error)
                core.info(`No existing issue returned for issue number: ${issueNumber}. Error: ${err.message}`);
            createdAt = '';
        }
    }
    return createdAt;
}
//# sourceMappingURL=create-issue-comment.js.map