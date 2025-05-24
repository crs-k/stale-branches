"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logRateLimit = logRateLimit;
const ansi_styles_1 = __importDefault(require("ansi-styles"));
function logRateLimit(rateLimit) {
    let rateLimitColor = `Rate Limit Used: ${ansi_styles_1.default.greenBright.open}${rateLimit.used}%${ansi_styles_1.default.greenBright.close}. Resets in ${ansi_styles_1.default.magenta.open}${rateLimit.reset}${ansi_styles_1.default.magenta.close} minutes.`;
    // color output based on remaining rate limit %
    if (rateLimit.used > 90) {
        rateLimitColor = `Rate Limit Used: ${ansi_styles_1.default.redBright.open}${rateLimit.used}%${ansi_styles_1.default.redBright.close}. Resets in ${ansi_styles_1.default.magenta.open}${rateLimit.reset}${ansi_styles_1.default.magenta.close} minutes.`;
    }
    else if (rateLimit.used >= 80) {
        rateLimitColor = `Rate Limit Used: ${ansi_styles_1.default.yellowBright.open}${rateLimit.used}%${ansi_styles_1.default.yellowBright.close}. Resets in ${ansi_styles_1.default.magenta.open}${rateLimit.reset}${ansi_styles_1.default.magenta.close} minutes.`;
    }
    else if (rateLimit.used < 80) {
        rateLimitColor = `Rate Limit Used: ${ansi_styles_1.default.greenBright.open}${rateLimit.used}%${ansi_styles_1.default.greenBright.close}. Resets in ${ansi_styles_1.default.magenta.open}${rateLimit.reset}${ansi_styles_1.default.magenta.close} minutes.`;
    }
    return rateLimitColor;
}
//# sourceMappingURL=log-rate-limit.js.map