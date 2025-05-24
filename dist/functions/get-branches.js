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
exports.getBranches = getBranches;
const assert = __importStar(require("assert"));
const core = __importStar(require("@actions/core"));
const get_context_1 = require("./get-context");
const log_get_branches_1 = require("./logging/log-get-branches");
const check_branch_protection_1 = require("./check-branch-protection");
/**
 * Retrieves all branches in a repository
 *
 * @returns {BranchResponse} A subset of data on all branches in a repository @see {@link BranchResponse}
 */
async function getBranches(includeProtectedBranches) {
    let branches;
    let listBranchesParams;
    if (includeProtectedBranches) {
        listBranchesParams = {
            owner: get_context_1.owner,
            repo: get_context_1.repo,
            per_page: 100
        };
    }
    else {
        listBranchesParams = {
            owner: get_context_1.owner,
            repo: get_context_1.repo,
            per_page: 100,
            protected: false
        };
    }
    try {
        const branchResponse = await get_context_1.github.paginate(get_context_1.github.rest.repos.listBranches, listBranchesParams, response => response.data.map(branch => ({
            branchName: branch.name,
            commmitSha: branch.commit.sha
        })));
        branches = branchResponse;
        if (includeProtectedBranches) {
            await (0, check_branch_protection_1.checkBranchProtection)(branches);
        }
        assert.ok(branches, 'Response cannot be empty.');
        core.info((0, log_get_branches_1.logGetBranches)(branches.length));
    }
    catch (err) {
        if (err instanceof Error) {
            core.setFailed(`Failed to retrieve branches for ${get_context_1.repo}. Error: ${err.message}`);
        }
        else {
            core.setFailed(`Failed to retrieve branches for ${get_context_1.repo}.`);
        }
        branches = [{ branchName: '', commmitSha: '' }];
    }
    return branches;
}
//# sourceMappingURL=get-branches.js.map