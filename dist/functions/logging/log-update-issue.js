"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logUpdateIssue = logUpdateIssue;
const ansi_styles_1 = __importDefault(require("ansi-styles"));
function logUpdateIssue(issueNumber, createdAt, commentUrl) {
    const updateIssue = `Issue ${ansi_styles_1.default.cyan.open}#${issueNumber}${ansi_styles_1.default.cyan.close} comment was created at ${ansi_styles_1.default.magenta.open}${createdAt}${ansi_styles_1.default.magenta.close}. ${commentUrl}`;
    return updateIssue;
}
//# sourceMappingURL=log-update-issue.js.map