"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIssueTitleString = createIssueTitleString;
/**
 * Creates title string for GitHub issues
 *
 * @param {string} branchName The name of a branch.
 *
 * @returns `[${branchName}] is STALE`
 */
function createIssueTitleString(branchName) {
    return `[${branchName}] is STALE`;
}
//# sourceMappingURL=create-issues-title-string.js.map