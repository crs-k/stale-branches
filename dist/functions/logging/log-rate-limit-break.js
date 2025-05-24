"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logRateLimitBreak = logRateLimitBreak;
const ansi_styles_1 = __importDefault(require("ansi-styles"));
function logRateLimitBreak(rateLimit) {
    const rateLimitBreak = `Exiting due to rate limit usage of ${ansi_styles_1.default.redBright.open}${rateLimit.used}%${ansi_styles_1.default.redBright.close}. Rate limit resets in ${ansi_styles_1.default.magenta.open}${rateLimit.reset}${ansi_styles_1.default.magenta.close} minutes @ ${ansi_styles_1.default.magenta.open}${rateLimit.resetDateTime}${ansi_styles_1.default.magenta.close}.`;
    return rateLimitBreak;
}
//# sourceMappingURL=log-rate-limit-break.js.map