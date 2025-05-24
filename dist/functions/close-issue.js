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
exports.closeIssue = closeIssue;
const assert = __importStar(require("assert"));
const core = __importStar(require("@actions/core"));
const get_context_1 = require("./get-context");
const log_close_issue_1 = require("./logging/log-close-issue");
/**
 * Closes a GitHub issue
 *
 * @param {number} issueNumber GitHub issue number
 *
 * @returns {string} The state of an issue (i.e. closed)
 */
async function closeIssue(issueNumber) {
    let state;
    try {
        const issueResponse = await get_context_1.github.rest.issues.update({
            owner: get_context_1.owner,
            repo: get_context_1.repo,
            issue_number: issueNumber,
            state: 'closed'
        });
        state = issueResponse.data.state;
        assert.ok(state, 'State cannot be empty');
        core.info((0, log_close_issue_1.logCloseIssue)(issueNumber, state));
    }
    catch (err) {
        if (err instanceof Error) {
            core.info(`No existing issue returned for issue number: ${issueNumber}. Description: ${err.message}`);
        }
        else {
            core.info(`No existing issue returned for issue number: ${issueNumber}.`);
        }
        state = '';
    }
    return state;
}
//# sourceMappingURL=close-issue.js.map