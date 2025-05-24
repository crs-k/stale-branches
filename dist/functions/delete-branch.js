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
exports.deleteBranch = deleteBranch;
const assert = __importStar(require("assert"));
const core = __importStar(require("@actions/core"));
const get_context_1 = require("./get-context");
const log_delete_branch_1 = require("./logging/log-delete-branch");
/**
 * Deletes a branch in a repository
 *
 * @param {string} name The name of a branch.
 *
 * @returns {number} HTTP response code (ex: 204)
 */
async function deleteBranch(name) {
    let confirm;
    const refAppend = 'heads/';
    const refFull = refAppend.concat(name);
    try {
        // Deletes branch based on it's ref
        const response = await get_context_1.github.rest.git.deleteRef({
            owner: get_context_1.owner,
            repo: get_context_1.repo,
            ref: refFull
        });
        confirm = response.status;
        assert.ok(response, 'response cannot be empty');
        core.info((0, log_delete_branch_1.logDeleteBranch)(refFull));
    }
    catch (err) {
        if (err instanceof Error) {
            core.error(`Failed to delete branch ${refFull}. Error: ${err.message}`);
        }
        else {
            core.error(`Failed to delete branch ${refFull}.`);
        }
        confirm = 500;
    }
    return confirm;
}
//# sourceMappingURL=delete-branch.js.map