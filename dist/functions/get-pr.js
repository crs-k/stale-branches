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
exports.getPr = getPr;
const core = __importStar(require("@actions/core"));
const get_context_1 = require("./get-context");
/**
 * Retrieves all pull requests for a branch in a repository
 *
 * @returns {pullRequests} A count of active pull requests for a branch
 */
async function getPr(branch) {
    let pullRequests = 0;
    try {
        // Check for incoming PRs
        const incomingPrResponse = await get_context_1.github.rest.pulls.list({
            owner: get_context_1.owner,
            repo: get_context_1.repo,
            base: branch
        });
        // Check for outgoing PRs
        const outgoingPrResponse = await get_context_1.github.rest.pulls.list({
            owner: get_context_1.owner,
            repo: get_context_1.repo,
            head: `${get_context_1.owner}:${branch}`
        });
        pullRequests = incomingPrResponse.data.length + outgoingPrResponse.data.length;
    }
    catch (err) {
        if (err instanceof Error) {
            core.setFailed(`Failed to retrieve pull requests for ${branch}. Error: ${err.message}`);
        }
        else {
            core.setFailed(`Failed to retrieve pull requests for ${branch}.`);
        }
        pullRequests = 0;
    }
    return pullRequests;
}
//# sourceMappingURL=get-pr.js.map