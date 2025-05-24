"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logNewIssue = logNewIssue;
const create_issues_title_string_1 = require("../utils/create-issues-title-string");
const ansi_styles_1 = __importDefault(require("ansi-styles"));
function logNewIssue(branchName) {
    const issueTitleString = (0, create_issues_title_string_1.createIssueTitleString)(branchName);
    const newIssue = `${ansi_styles_1.default.bold.open}New issue created:${ansi_styles_1.default.bold.close} ${ansi_styles_1.default.magentaBright.open}${issueTitleString}${ansi_styles_1.default.magentaBright.close}.`;
    return newIssue;
}
//# sourceMappingURL=log-new-issue.js.map