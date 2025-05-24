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
exports.getRecentCommitLogin = getRecentCommitLogin;
const assert = __importStar(require("assert"));
const core = __importStar(require("@actions/core"));
const get_context_1 = require("./get-context");
/**
 * Retrieves last committer's username
 *
 * @param {string} sha The SHA of the last commit
 *
 * @returns {string} The last committers username
 */
async function getRecentCommitLogin(sha) {
    let lastCommitter;
    try {
        const commitResponse = await get_context_1.github.rest.repos.getCommit({
            owner: get_context_1.owner,
            repo: get_context_1.repo,
            ref: sha,
            per_page: 1,
            page: 1
        });
        const commitData = commitResponse.data;
        lastCommitter = commitData.committer?.login;
        if (!lastCommitter || lastCommitter === 'web-flow') {
            lastCommitter = commitData.author?.login || commitData.commit?.committer?.name || commitData.commit?.author?.name;
        }
        assert.ok(lastCommitter, 'Committer cannot be empty.');
    }
    catch (err) {
        if (err instanceof Error) {
            core.info(`Failed to retrieve commit for ${sha} in ${get_context_1.repo}. Error: ${err.message}`);
        }
        else {
            core.info(`Failed to retrieve commit for ${sha} in ${get_context_1.repo}.`);
        }
        lastCommitter = '';
    }
    return lastCommitter;
}
//# sourceMappingURL=get-committer-login.js.map