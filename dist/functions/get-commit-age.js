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
exports.getRecentCommitAge = getRecentCommitAge;
exports.getRecentCommitAgeByNonIgnoredMessage = getRecentCommitAgeByNonIgnoredMessage;
const assert = __importStar(require("assert"));
const core = __importStar(require("@actions/core"));
const get_context_1 = require("./get-context");
const get_time_1 = require("./utils/get-time");
/**
 * Calcualtes the age of a commit in days
 *
 * @param {string} sha The SHA of the last commit
 *
 * @returns {number} The age of the commit
 */
async function getRecentCommitAge(sha) {
    let commitDate;
    const currentDate = Date.now();
    try {
        const commitResponse = await get_context_1.github.rest.repos.getCommit({
            owner: get_context_1.owner,
            repo: get_context_1.repo,
            ref: sha,
            per_page: 1,
            page: 1
        });
        commitDate = commitResponse.data.commit.committer.date;
        assert.ok(commitDate, 'Date cannot be empty.');
    }
    catch (err) {
        if (err instanceof Error) {
            core.setFailed(`Failed to retrieve commit for ${sha} in ${get_context_1.repo}. Error: ${err.message}`);
        }
        else {
            core.setFailed(`Failed to retrieve commit for ${sha} in ${get_context_1.repo}.`);
        }
        commitDate = '';
    }
    const commitDateTime = new Date(commitDate).getTime();
    const commitAge = (0, get_time_1.getDays)(currentDate, commitDateTime);
    return commitAge;
}
/**
 * Calculates the age of the most recent commit not matching any ignored commit messages, up to a max age.
 *
 * @param {string} sha The SHA of the branch head
 * @param {string[]} ignoredMessages Array of commit messages or substrings to ignore
 * @param {number} [maxAgeDays] Optional. If provided, stop searching if a commit is older than this many days.
 *
 * @returns {number} The age of the most recent non-ignored commit, or maxAgeDays if none found within that range
 */
async function getRecentCommitAgeByNonIgnoredMessage(sha, ignoredMessages, maxAgeDays) {
    const currentDate = Date.now();
    let page = 1;
    let commitDate;
    let found = false;
    while (!found) {
        const commitsResponse = await get_context_1.github.rest.repos.listCommits({
            owner: get_context_1.owner,
            repo: get_context_1.repo,
            sha,
            per_page: 100,
            page
        });
        if (commitsResponse.data.length === 0)
            break;
        for (const commit of commitsResponse.data) {
            const message = commit.commit?.message || '';
            const commitDateStr = commit.commit?.committer?.date;
            if (!commitDateStr)
                continue;
            const commitDateTime = new Date(commitDateStr).getTime();
            const commitAge = (0, get_time_1.getDays)(currentDate, commitDateTime);
            // If maxAgeDays is set and this commit is older than the threshold, stop searching
            if (maxAgeDays !== undefined && commitAge > maxAgeDays) {
                // If we haven't found a valid commit yet, return maxAgeDays
                if (!commitDate) {
                    return maxAgeDays;
                }
                else {
                    // We already found a valid commit in this or a previous page, break out
                    found = true;
                    break;
                }
            }
            if (ignoredMessages.some(msg => message.includes(msg))) {
                continue;
            }
            // Found a valid commit within the window
            commitDate = commitDateStr;
            found = true;
            break;
        }
        if (found)
            break;
        page++;
    }
    if (commitDate) {
        const commitDateTime = new Date(commitDate).getTime();
        return (0, get_time_1.getDays)(currentDate, commitDateTime);
    }
    throw new Error('No non-ignored commit found');
}
//# sourceMappingURL=get-commit-age.js.map