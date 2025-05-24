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
exports.compareBranches = compareBranches;
const assert = __importStar(require("assert"));
const core = __importStar(require("@actions/core"));
const get_context_1 = require("./get-context");
const input_compare_branches_1 = require("../enums/input-compare-branches");
const get_default_branch_1 = require("./get-default-branch");
const log_compare_branches_1 = require("./logging/log-compare-branches");
/**
 * Compares HEAD branch to BASE branch
 *
 * @param {string} head The name of the head branch
 *
 * @param {string} inputCompareBranches The value from the compare-branches input
 *
 * @returns {BranchComparison} The status of the HEAD branch vs. BASE branch @see {@link BranchComparison}
 */
async function compareBranches(head, inputCompareBranches) {
    const branchComparison = {};
    branchComparison.save = false;
    if (inputCompareBranches !== input_compare_branches_1.CompareBranchesEnum.off) {
        const base = await (0, get_default_branch_1.getDefaultBranch)();
        const refAppend = 'heads/';
        const baseFull = refAppend.concat(base);
        const headFull = refAppend.concat(head);
        const basehead = `${baseFull}...${headFull}`;
        try {
            const branchComparisonResponse = await get_context_1.github.rest.repos.compareCommitsWithBasehead({
                owner: get_context_1.owner,
                repo: get_context_1.repo,
                basehead
            });
            if (inputCompareBranches === input_compare_branches_1.CompareBranchesEnum.save && (branchComparisonResponse.data.status === 'ahead' || branchComparisonResponse.data.status === 'diverged')) {
                branchComparison.save = true;
            }
            branchComparison.aheadBy = branchComparisonResponse.data.ahead_by;
            branchComparison.behindBy = branchComparisonResponse.data.behind_by;
            branchComparison.branchStatus = branchComparisonResponse.data.status;
            branchComparison.totalCommits = branchComparisonResponse.data.total_commits;
            assert.ok(branchComparison.branchStatus, 'Branch Comparison Status cannot be empty.');
            core.info((0, log_compare_branches_1.logCompareBranches)(branchComparison, base, head));
        }
        catch (err) {
            if (err instanceof Error) {
                core.info(`Failed to retrieve branch comparison data. Error: ${err.message}`);
            }
            else {
                core.info(`Failed to retrieve branch comparison data.`);
            }
        }
    }
    return branchComparison;
}
//# sourceMappingURL=compare-branches.js.map