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
exports.getDefaultBranch = getDefaultBranch;
const assert = __importStar(require("assert"));
const core = __importStar(require("@actions/core"));
const get_context_1 = require("./get-context");
/**
 * Retrieves the default branch for the repository
 *
 * @returns {string} The default branch
 */
async function getDefaultBranch() {
    let result;
    try {
        // Get the default branch from the repo info
        const response = await get_context_1.github.rest.repos.get({ owner: get_context_1.owner, repo: get_context_1.repo });
        result = response.data.default_branch;
        assert.ok(result, 'default_branch cannot be empty');
    }
    catch (err) {
        // Handle .wiki repo
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (err?.status === 404 && get_context_1.repo.toUpperCase().endsWith('.WIKI')) {
            result = 'main';
        }
        // Otherwise error
        else {
            if (err instanceof Error)
                core.setFailed(`Failed to get default branch: ${err.message}`);
            result = '';
        }
    }
    return result;
}
//# sourceMappingURL=get-default-branch.js.map