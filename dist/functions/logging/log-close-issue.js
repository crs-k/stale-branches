"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logCloseIssue = logCloseIssue;
const ansi_styles_1 = __importDefault(require("ansi-styles"));
function logCloseIssue(issueNumber, state) {
    const closeIssue = `Issue ${ansi_styles_1.default.cyan.open}#${issueNumber}${ansi_styles_1.default.cyan.close}'s state was changed to ${ansi_styles_1.default.redBright.open}${state}${ansi_styles_1.default.redBright.close}.`;
    return closeIssue;
}
//# sourceMappingURL=log-close-issue.js.map