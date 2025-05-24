"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logActiveBranch = logActiveBranch;
const ansi_styles_1 = __importDefault(require("ansi-styles"));
function logActiveBranch(branchName) {
    const closeIssue = `[${ansi_styles_1.default.green.open}${branchName}${ansi_styles_1.default.green.close}] has become active again.`;
    return closeIssue;
}
//# sourceMappingURL=log-active-branch.js.map