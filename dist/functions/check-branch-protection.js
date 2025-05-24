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
exports.checkBranchProtection = checkBranchProtection;
const core = __importStar(require("@actions/core"));
const get_context_1 = require("./get-context");
const request_error_1 = require("@octokit/request-error");
/**
 * Removes branches that don´t allow deletions
 */
async function checkBranchProtection(branches) {
    const branchesToRemove = [];
    // Get the default branch from the repository
    let defaultBranch;
    try {
        const repoInfo = await get_context_1.github.rest.repos.get({
            owner: get_context_1.owner,
            repo: get_context_1.repo
        });
        defaultBranch = repoInfo.data.default_branch;
        core.info(`Default branch: ${defaultBranch}\n`);
    }
    catch (err) {
        core.warning(`Failed to fetch default branch: ${err instanceof Error ? err.message : 'Unknown error'}`);
        return;
    }
    const includeProtectedBranches = core.getInput('include-protected-branches').toLowerCase() === 'true';
    for (const branch of branches) {
        // Skip the default branch
        if (branch.branchName === defaultBranch) {
            core.info(`⚠️ Skipping default branch: ${defaultBranch}\n`);
            continue;
        }
        core.startGroup(`Checking: ${branch.branchName}`);
        let hasBranchProtection = false;
        let branchProtectionAllowsDeletion = false;
        let hasRulesetProtection = false;
        let rulesetAllowsDeletion = false;
        // Check branch protection
        try {
            const branchProtection = await get_context_1.github.rest.repos.getBranchProtection({
                owner: get_context_1.owner,
                repo: get_context_1.repo,
                branch: branch.branchName
            });
            hasBranchProtection = true;
            branchProtectionAllowsDeletion = branchProtection.data.allow_deletions?.enabled ?? false;
        }
        catch (err) {
            if (err instanceof request_error_1.RequestError && err.status === 404) {
                // No branch protection
            }
        }
        // Check rulesets
        try {
            const rulesets = (await get_context_1.github.rest.repos.getBranchRules({
                owner: get_context_1.owner,
                repo: get_context_1.repo,
                branch: branch.branchName
            }));
            hasRulesetProtection = rulesets.data.length > 0;
            rulesetAllowsDeletion = !rulesets.data.some(ruleset => !ruleset.deletion);
        }
        catch (err) {
            if (err instanceof request_error_1.RequestError && err.status === 404) {
                // No rulesets
            }
        }
        // Determine protection type
        let isProtected = false;
        let protectionType = '';
        if (hasBranchProtection && !branchProtectionAllowsDeletion && hasRulesetProtection && !rulesetAllowsDeletion) {
            isProtected = true;
            protectionType = 'branch protection and ruleset';
        }
        else if (hasBranchProtection && !branchProtectionAllowsDeletion) {
            isProtected = true;
            protectionType = 'branch protection';
        }
        else if (hasRulesetProtection && !rulesetAllowsDeletion) {
            isProtected = true;
            protectionType = 'ruleset';
        }
        if (isProtected) {
            if (includeProtectedBranches) {
                core.info(`✅ ${branch.branchName} is protected by ${protectionType} and is eligible for deletion`);
            }
            else {
                core.info(`❌ ${branch.branchName} is protected by ${protectionType} and cannot be deleted`);
                branchesToRemove.push(branch);
            }
        }
        else {
            core.info(`✅ ${branch.branchName} is eligible for deletion`);
        }
        core.endGroup();
        core.info('---\n');
    }
    // remove branches that don´t allow deletions
    for (const branch of branchesToRemove) {
        const index = branches.indexOf(branch, 0);
        if (index > -1) {
            branches.splice(index, 1);
        }
    }
}
//# sourceMappingURL=check-branch-protection.js.map