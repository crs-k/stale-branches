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
exports.getRateLimit = getRateLimit;
const assert = __importStar(require("assert"));
const core = __importStar(require("@actions/core"));
const get_time_1 = require("./utils/get-time");
const get_context_1 = require("./get-context");
/**
 * Returns data on current rate limit usage for this repository
 *
 * @returns {RateLimit} data related to current rate limit usage @see {@link RateLimit}
 */
async function getRateLimit() {
    let rateLimit = {};
    const rateLimitResponse = {};
    try {
        rateLimit = await get_context_1.github.rest.rateLimit.get();
        const rateLimitUsed = Math.round((rateLimit.data.resources.core.used / rateLimit.data.resources.core.limit) * 100);
        const rateLimitRemaining = Math.round((rateLimit.data.resources.core.remaining / rateLimit.data.resources.core.limit) * 100);
        const currentDate = new Date().getTime();
        const rateLimitReset = new Date(rateLimit.data.resources.core.reset * 1000).getTime();
        const rateLimitResetMinutes = (0, get_time_1.getMinutes)(currentDate, rateLimitReset);
        rateLimitResponse.used = rateLimitUsed;
        rateLimitResponse.remaining = rateLimitRemaining;
        rateLimitResponse.reset = rateLimitResetMinutes;
        rateLimitResponse.resetDateTime = new Date(rateLimitReset);
        assert.ok(rateLimitResponse, 'Rate Limit Response cannot be empty.');
    }
    catch (err) {
        if (err instanceof Error) {
            core.info(`Failed to retrieve rate limit data. Error: ${err.message}`);
        }
        else {
            core.info(`Failed to retrieve rate limit data.`);
        }
    }
    return rateLimitResponse;
}
//# sourceMappingURL=get-rate-limit.js.map