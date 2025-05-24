"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logSkippedBranch = logSkippedBranch;
const ansi_styles_1 = __importDefault(require("ansi-styles"));
function logSkippedBranch(branchName, activePrs) {
    const skippedBranch = `${ansi_styles_1.default.bold.open}${branchName}${ansi_styles_1.default.bold.close} was skipped due to ${ansi_styles_1.default.magenta.open}${activePrs}${ansi_styles_1.default.magenta.close} active pull request(s).`;
    return skippedBranch;
}
//# sourceMappingURL=log-skipped-branch.js.map